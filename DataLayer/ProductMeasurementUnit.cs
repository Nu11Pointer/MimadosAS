using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class ProductMeasurementUnit
    {
        public List<Entity.ProductMeasurementUnit> Read()
        {
            var productMeasurementUnits = new List<Entity.ProductMeasurementUnit>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar Consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.Text,
                        CommandText = "SELECT * FROM ProductMeasurementUnit",
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
                            productMeasurementUnits.Add(new Entity.ProductMeasurementUnit()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Name = Convert.ToString(reader["Name"]),
                                Symbol = Convert.ToString(reader["Symbol"]),
                                Active = Convert.ToBoolean(reader["Active"])
                            });
                        }
                    }
                }
            }
            catch (Exception e)
            {
            }
            return productMeasurementUnits;
        }
    }
}
