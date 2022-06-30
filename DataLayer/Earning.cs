using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class Earning
    {
        private readonly string _CommandText = "SELECT top 12 * FROM [view_monthly_earnings] ORDER BY[Year] DESC, [Month] ASC";

        public List<Entity.Earning> Read()
        {
            var earnings = new List<Entity.Earning>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar Consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.Text,
                        CommandText = _CommandText,
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
                            earnings.Add(new Entity.Earning()
                            {
                                Month = Convert.ToInt32(reader["Month"]),
                                Year = Convert.ToInt32(reader["Year"]),
                                SubTotal = Convert.ToDecimal(reader["SubTotal"])
                            });
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            return earnings;
        }
    }
}
