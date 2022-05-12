using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class Sale
    {
        private readonly string _CommandText = "sp_sale";

        public bool Create(Entity.Sale sale, string saleDetail, out string message, out int id)
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

                    cmd.Parameters.AddWithValue("CurrencyId", sale.Currency.Id);
                    cmd.Parameters.AddWithValue("PaymentTypeId", sale.PaymentType.Id);
                    cmd.Parameters.AddWithValue("CustomerId", sale.Customer.Id);
                    cmd.Parameters.AddWithValue("EmployeeId", sale.Employee.Id);
                    cmd.Parameters.AddWithValue("Payment", sale.Payment);
                    cmd.Parameters.AddWithValue("SaleDetail", saleDetail);

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

        public List<Entity.Sale> Read()
        {
            var sales = new List<Entity.Sale>();
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
                            sales.Add(new Entity.Sale()
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
                                Customer = new Entity.Customer()
                                {
                                    Id = Convert.ToInt32(reader["CustomerId"]),
                                    Name = Convert.ToString(reader["CustomerName"]),
                                    SurName = Convert.ToString(reader["CustomerSurName"])
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
            catch (Exception)
            {
            }
            return sales;
        }

        public List<Entity.SaleDetail> Detail(int id)
        {
            var saleDetails = new List<Entity.SaleDetail>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar Consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.Text,
                        CommandText = $"SELECT * FROM [view_saledetail] WHERE SaleId ={id}",
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
                            saleDetails.Add(new Entity.SaleDetail()
                            {
                                SaleId = Convert.ToInt32(reader["SaleId"]),
                                Product = new Entity.Product()
                                {
                                    Id = Convert.ToInt32(reader["ProductId"]),
                                    Name = Convert.ToString(reader["Product"])
                                },
                                SalePrice = Convert.ToDecimal(reader["SalePrice"]),
                                Quantity = Convert.ToInt32(reader["Quantity"]),
                                Active = Convert.ToBoolean(reader["Active"])
                            });
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            return saleDetails;
        }
    }
}
