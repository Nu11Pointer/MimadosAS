using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class PaymentType
    {
        private readonly string _commandText = "sp_paymenttype";

        public bool Create(Entity.PaymentType paymentType, out string message)
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
                        CommandText = _commandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "C");

                    cmd.Parameters.AddWithValue("Name", paymentType.Name);
                    cmd.Parameters.AddWithValue("Active", paymentType.Active);

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

        public List<Entity.PaymentType> Read()
        {
            var currencies = new List<Entity.PaymentType>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar Consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _commandText,
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
                            currencies.Add(new Entity.PaymentType()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Name = Convert.ToString(reader["Name"]),
                                Active = Convert.ToBoolean(reader["Active"])
                            });
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            return currencies;
        }

        public bool Update(Entity.PaymentType paymentType, out string message)
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
                        CommandText = _commandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "U");

                    cmd.Parameters.AddWithValue("Id", paymentType.Id);
                    cmd.Parameters.AddWithValue("Name", paymentType.Name);
                    cmd.Parameters.AddWithValue("Active", paymentType.Active);

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

        public bool Delete(Entity.PaymentType paymentType, out string message)
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
                        CommandText = _commandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "D");

                    cmd.Parameters.AddWithValue("Id", paymentType.Id);

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
