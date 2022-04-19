using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class Purchase
    {
        private readonly string _CommandText = "sp_purchase";

        public bool Create(Entity.Purchase purchase, out string message)
        {
            bool result;

            try
            {
                // Crear Conexión
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _CommandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "C");

                    cmd.Parameters.AddWithValue("ProductId", purchase.Product.Id);
                    cmd.Parameters.AddWithValue("SupplierId", purchase.Supplier.Id);
                    cmd.Parameters.AddWithValue("Quantity", purchase.Quantity);
                    cmd.Parameters.AddWithValue("PurchasePrice", purchase.PurchasePrice);
                    cmd.Parameters.AddWithValue("Active", purchase.Active);

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;


                    // Abrir Conexion
                    connection.Open();

                    // Ejecutar consulta
                    cmd.ExecuteNonQuery();

                    // Guardar el resultado y el mensaje
                    result = Convert.ToBoolean(cmd.Parameters["Result"].Value);
                    message = Convert.ToString(cmd.Parameters["Message"].Value);
                }
            }
            catch (Exception e)
            {
                result = false;
                message = e.Message;
            }
            return result;
        }

        public List<Entity.Purchase> Read()
        {
            var purchases = new List<Entity.Purchase>();

            try
            {
                // Crear Conección
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar Consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _CommandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "R");

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;

                    // Abrir Conexión
                    connection.Open();

                    // Ejecutar la Consulta
                    using (var reader = cmd.ExecuteReader())
                    {
                        // Leer cada fila de la tabla
                        while (reader.Read())
                        {
                            // Añadir Cada Elemento a La Lista
                            purchases.Add(new Entity.Purchase()
                            {
                                Product = new Entity.Product()
                                {
                                    Id = Convert.ToInt32(reader["ProductId"]),
                                    Name = Convert.ToString(reader["Product"]),
                                    Active = Convert.ToBoolean(reader["ProductActive"])
                                },
                                Supplier = new Entity.Supplier()
                                {
                                    Id = Convert.ToInt32(reader["SupplierId"]),
                                    Name = Convert.ToString(reader["Supplier"]),
                                    Active = Convert.ToBoolean(reader["SupplierActive"])
                                },
                                Quantity = Convert.ToInt32(reader["Quantity"]),
                                PurchasePrice = Convert.ToInt32(reader["PurchasePrice"]),
                                TimeStamp = Convert.ToDateTime(reader["TimeStamp"]),
                                StringTimeStamp = Convert.ToString(reader["TimeStamp"]),
                                Active = Convert.ToBoolean(reader["Active"])
                            });
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            return purchases;
        }

        public bool Update(Entity.Purchase purchase, out string message)
        {
            bool result;

            try
            {
                // Crear Conexión
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _CommandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "U");

                    cmd.Parameters.AddWithValue("ProductId", purchase.Product.Id);
                    cmd.Parameters.AddWithValue("SupplierId", purchase.Supplier.Id);
                    cmd.Parameters.AddWithValue("Quantity", purchase.Quantity);
                    cmd.Parameters.AddWithValue("PurchasePrice", purchase.PurchasePrice);
                    cmd.Parameters.AddWithValue("TimeStamp", Convert.ToDateTime(purchase.StringTimeStamp));
                    cmd.Parameters.AddWithValue("Active", purchase.Active);

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;


                    // Abrir Conexion
                    connection.Open();

                    // Ejecutar consulta
                    cmd.ExecuteNonQuery();

                    // Guardar el resultado y el mensaje
                    result = Convert.ToBoolean(cmd.Parameters["Result"].Value);
                    message = Convert.ToString(cmd.Parameters["Message"].Value);
                }
            }
            catch (Exception e)
            {
                result = false;
                message = e.Message;
            }
            return result;
        }

        public bool Delete(Entity.Purchase purchase, out string message)
        {
            bool result;

            try
            {
                // Crear Conexión
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _CommandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "D");

                    cmd.Parameters.AddWithValue("TimeStamp", Convert.ToDateTime(purchase.StringTimeStamp));

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;


                    // Abrir Conexion
                    connection.Open();

                    // Ejecutar consulta
                    cmd.ExecuteNonQuery();

                    // Guardar el resultado y el mensaje
                    result = Convert.ToBoolean(cmd.Parameters["Result"].Value);
                    message = Convert.ToString(cmd.Parameters["Message"].Value);
                }
            }
            catch (Exception e)
            {
                result = false;
                message = e.Message;
            }
            return result;
        }
    }
}
