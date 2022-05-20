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

        public bool Create(Entity.Purchase purchase, string purchaseDetails, out string message, out int id)
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

                    cmd.Parameters.AddWithValue("CurrencyId", purchase.Currency.Id);
                    cmd.Parameters.AddWithValue("PaymentTypeId", purchase.PaymentType.Id);
                    cmd.Parameters.AddWithValue("SupplierId", purchase.Supplier.Id);
                    cmd.Parameters.AddWithValue("EmployeeId", purchase.Employee.Id);
                    cmd.Parameters.AddWithValue("Payment", purchase.Payment);
                    cmd.Parameters.AddWithValue("PurchaseDetail", purchaseDetails);

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Scope", SqlDbType.Int).Direction = ParameterDirection.Output;


                    // Abrir Conexion
                    connection.Open();

                    // Ejecutar consulta
                    cmd.ExecuteNonQuery();

                    // Guardar el resultado, el mensaje y el id de la venta creada
                    result = Convert.ToBoolean(cmd.Parameters["Result"].Value);
                    message = Convert.ToString(cmd.Parameters["Message"].Value);
                    id = Convert.ToInt32(cmd.Parameters["Scope"].Value);
                }
            }
            catch (Exception e)
            {
                id = -1;
                result = false;
                message = e.Message;
            }
            return result;
        }

        public List<Entity.Purchase> Read()
        {
            var sales = new List<Entity.Purchase>();
            try
            {
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
                            sales.Add(new Entity.Purchase()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Currency = new Entity.Currency()
                                {
                                    Id = Convert.ToInt32(reader["CurrencyId"])
                                },
                                PaymentType = new Entity.PaymentType()
                                {
                                    Id = Convert.ToInt32(reader["PaymentTypeId"])
                                },
                                Supplier = new Entity.Supplier()
                                {
                                    Id = Convert.ToInt32(reader["SupplierId"]),
                                    Name = Convert.ToString(reader["Supplier"])
                                },
                                Employee = new Entity.Employee()
                                {
                                    Id = Convert.ToInt32(reader["EmployeeId"]),
                                    Name = Convert.ToString(reader["EmployeeName"]),
                                    SurName = Convert.ToString(reader["EmployeeSurName"])
                                },
                                Payment = Convert.ToDecimal(reader["Payment"]),
                                Total = Convert.ToDecimal(reader["Total"]),
                                TimeStamp = Convert.ToDateTime(reader["TimeStamp"]),
                                StringTimeStamp = Convert.ToString(reader["TimeStamp"]),
                                Active = Convert.ToBoolean(reader["Active"])
                            });
                        }
                    }
                }
            }
            catch (Exception e)
            {
                var error = e.Message;
                Console.WriteLine(error);
            }
            return sales;
        }

        public List<Entity.PurchaseDetails> Detail(int id)
        {
            var saleDetails = new List<Entity.PurchaseDetails>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar Consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.Text,
                        CommandText = $"SELECT * FROM [view_purchasedetail] WHERE PurchaseId ={id}",
                        Connection = connection
                    };

                    // Abrir Conexión
                    connection.Open();

                    // Ejecutar la Consulta
                    using (var reader = cmd.ExecuteReader())
                    {
                        // Leer cada fila de la tabla
                        while (reader.Read())
                        {
                            // Añadir Cada Elemento a La Lista
                            saleDetails.Add(new Entity.PurchaseDetails()
                            {
                                PurchaseId = Convert.ToInt32(reader["PurchaseId"]),
                                Product = new Entity.Product()
                                {
                                    Id = Convert.ToInt32(reader["ProductId"]),
                                    Name = Convert.ToString(reader["Product"])
                                },
                                PurchasePrice = Convert.ToDecimal(reader["PurchasePrice"]),
                                Quantity = Convert.ToInt32(reader["Quantity"]),
                                Active = Convert.ToBoolean(reader["Active"])
                            });
                        }
                    }
                }
            }
            catch (Exception e)
            {
                var error = e.Message;
                Console.WriteLine(error);
            }
            return saleDetails;
        }
    }
}
