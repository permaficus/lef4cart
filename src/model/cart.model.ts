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
    userId: string,
    quantity: number
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
            const transaction = await DB.$transaction(async model => {
                const doc = await model.shopping_cart.findFirst({
                    where: {
                        user_id: payload?.userId
                    },
                    select: { id: true }
                });
                if (!doc?.id) {
                    throw new Error(`User ID doesn't exist`);
                }
                return await model.shopping_cart.update({
                    where: {
                        id: doc.id
                    },
                    data: {
                        quantity: payload.quantity
                    }
                })
            });
            DB.$disconnect();
            return transaction;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    static remove = async (cartId: any) => {
        try {
            const response = await DB.shopping_cart.delete({
                where: {
                    id: cartId
                }
            })
            return {
                document: response
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}