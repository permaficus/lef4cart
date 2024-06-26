import { DB, prismaErrHandler } from "@/libs/prisma.utils";

export interface DataSet {
    apps_id?: string | undefined | null
    merchant_name?: string | undefined | null
    merchant_id?: string | undefined | null
    session_id?: string | undefined | null
    user_id: string
    product_id: string
    product_name: string
    product_image: string
    custom_fields?: object
    price: number
    quantity: number
    totals?: number
    product_links?: object | undefined
}
interface UpdatePayload {
    user_id: string
    product_id: string
    quantity: number
    params: 'increment' | 'decrement'
}

type HasValueProps<T> = {[K in keyof T as T[K] extends null | undefined ? never : K]: T[K]};
const removeNullProps = <T extends {}, V = HasValueProps<T>>(obj: T): V => {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => 
            !(
                ( value === null || value === undefined )
            )
        )
    ) as V
}

export class Cart {
    static push = async (dataSet: DataSet) => {
        try {
            if (!dataSet.totals) {
                Object.assign(dataSet, { totals: dataSet.quantity * dataSet.price })
            }
            const response: any = await DB.shopping_cart.create({
                data: dataSet
            });
            DB.$disconnect();
            return {
                status: 'OK',
                details: removeNullProps(response)
            }       
        } catch (error: any) {
            prismaErrHandler(error);
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
                data: response.map((items: any) => removeNullProps(items))
            }
        } catch (error: any) {
            prismaErrHandler(error)
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
                    select: { id: true, price: true }
                });
                if (!doc?.id) {
                    throw new Error(`There is no data referrence to this ID: ${payload?.user_id} or ${payload?.product_id}#Code: 404`);
                }
                return await model.shopping_cart.update({
                    where: {
                        id: doc.id
                    },
                    data: {
                        quantity: { [params]: payload.quantity }, 
                        totals: { [params]: payload.quantity * doc.price }
                    }
                })
            });
            DB.$disconnect();
            return removeNullProps(transaction);
        } catch (error: any) {
            prismaErrHandler(error)
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
            prismaErrHandler(error)
        }
    }
    /**
     * 
     * @param dataSet 
     * @returns {string}: 'update'
     */
    static checkDuplicate = async (dataSet: any): Promise<number | undefined> => {
        try {
            const count = await DB.shopping_cart.count({
                where: {
                    AND:[
                        { user_id: dataSet.user_id },
                        { product_id: dataSet.product_id }
                    ]
                }
            }) ;
            return count
        } catch (error: any) {
            prismaErrHandler(error)
        }
    } 
}