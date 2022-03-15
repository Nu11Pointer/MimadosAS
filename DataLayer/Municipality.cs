using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class Municipality
    {
        public List<Entity.Municipality> Read()
        {
            var municipalityList = new List<Entity.Municipality>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_municipality_read",
                        Connection = connection
                    };

                    connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            municipalityList.Add(new Entity.Municipality()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
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
            return municipalityList;
        }
    }
}
