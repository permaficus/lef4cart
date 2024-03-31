import { DB } from "../libs/prisma.utils";

export interface DataSet {
    apps_id?: string | undefined | null
    merchant_name?: string | undefined | null
    merchant_id?: string | undefined | null
    session_id?: string | undefined | null
    user_id: string
    product_id: string
    product_name: string
    product_image: string
    price: number
    quantity: number
}
interface UpdatePayload {
    user_id: string
    product_id: string
    quantity: number
    params: 'increment' | 'decrement'
}
export class Cart {
    static push = async (dataSet: DataSet) => {
        try {
            const response = await DB.shopping_cart.create({
                data: dataSet
            });
            DB.$disconnect();     
            return {
                status: 'OK',
                details: response
            }       
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    static read = async (userId: any) => {
        try {
            const response = await DB.shopping_cart.findMany({
                where: {
                    user_id: userId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            DB.$disconnect();
            return {
                status: 'OK',
                data: response
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    /**
     * 
     * @param userId (string)
     * @param quantity (number)
     * @description: we only accept quantity update, anything else will be discarded
     */
    static update = async (payload: UpdatePayload) => {
        try {
            const { params } = payload;
            const transaction = await DB.$transaction(async model => {
                const doc = await model.shopping_cart.findFirst({
                    where: {
                        AND: [
                            { user_id: payload?.user_id },
                            { product_id: payload?.product_id }
                        ]
                    },
                    select: { id: true }
                });
                if (!doc?.id) {
                    throw new Error(JSON.stringify({
                        status: 'ERROR_BAD_REQUEST',
                        code: 400,
                        details: `User ID does not exist `
                    }));
                }
                return await model.shopping_cart.update({
                    where: {
                        id: doc.id
                    },
                    data: {
                        quantity: {
                            ...params == 'increment' ? {increment: payload.quantity} : {decrement: payload.quantity}
                        }
                    }
                })
            });
            DB.$disconnect();
            return transaction;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    static remove = async (cartId: any = []) => {
        try {
            const response = await DB.shopping_cart.deleteMany({
                where: {
                    id: { in: cartId } 
                }
            })
            return {
                document: response
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    /**
     * 
     * @param dataSet 
     * @returns {string}: 'update'
     */
    static checkDuplicate = async (dataSet: any): Promise<number> => {
        const count = await DB.shopping_cart.count({
            where: {
                AND:[
                    { user_id: dataSet.user_id },
                    { product_id: dataSet.product_id }
                ]
            }
        }) ;
        return count
    } 
}