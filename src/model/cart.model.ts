import { DB } from "../libs/prisma.utils";

interface DataSet {
    apps_id?: string | undefined | null
    merchant_name?: string | undefined | null
    user_id: string
    product_id: string
    product_name: string
    product_image: string
    price: number
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
            throw error;
        }
    }
    static read = async (userId: any) => {
        try {
            const response = await DB.shopping_cart.groupBy({
                by: ['user_id'],
                where: {
                    user_id: userId
                }
            })
            DB.$disconnect();
            return {
                status: 'OK',
                data: response
            }
        } catch (error: any) {
            throw error
        }
    }
}