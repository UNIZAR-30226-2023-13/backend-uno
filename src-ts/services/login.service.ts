import { QueryError,createConnection,RowDataPacket } from 'mysql2';
const bcrypt = require('bcryptjs');
const dbConfig = require('../configs/db.config');


export async function comprobarContrasena(username:String, contrasena:String): Promise<Boolean>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        // Definir query 
        const queryString: string = 'SELECT \
                                        u.password \
                                    FROM usuarios AS u \
                                    WHERE u.username = ?'
        
        db.query(queryString, [username], async (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
                
            }
            else{
                if(rows.length>0){
                    const contraseñaHasheada : String = rows[0].password;
                    const iguales : Boolean = await bcrypt.compare(contrasena, contraseñaHasheada);
                    resolve(iguales);
                }
                else{
                    resolve(false);
                }   
            }
        });
    })
}
