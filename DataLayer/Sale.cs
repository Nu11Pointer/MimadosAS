using System;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class Sale
    {
        private readonly string _CommandText = "sp_sale";

        public bool Create(Entity.Sale sale, string saleDetail, out string message)
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
