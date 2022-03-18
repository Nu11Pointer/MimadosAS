using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity = EntityLayer;

namespace DataLayer
{
    public class BranchOfficePhone
    {
        public List<Entity.BranchOfficePhone> Read()
        {
            var branchOfficeList = new List<Entity.BranchOfficePhone>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_branchofficephone_read",
                        Connection = connection
                    };

                    connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            branchOfficeList.Add(new Entity.BranchOfficePhone()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                BranchOffice = new Entity.BranchOffice()
                                {
                                    Id = Convert.ToInt32(reader["BranchOfficeId"]),
                                    Name = Convert.ToString(reader["BranchOffice"])
                                },
                                PhoneNumber = Convert.ToString(reader["PhoneNumber"]),
                                Active = Convert.ToBoolean(reader["Active"])
                            });
                        }
                    }
                }
            }
            catch (Exception e)
            {
                var message = e.Message;
                Console.WriteLine(message);
            }
            return branchOfficeList;
        }
    }
}
