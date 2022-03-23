using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class BranchOffice
    {
        public int Create(Entity.BranchOffice branchOffice, out string message)
        {
            int result;
            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_branchoffice",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "C");

                    cmd.Parameters.AddWithValue("Name", branchOffice.Name);
                    cmd.Parameters.AddWithValue("Address", branchOffice.Address);
                    cmd.Parameters.AddWithValue("MunicipalityId", branchOffice.Municipality.Id);
                    cmd.Parameters.AddWithValue("Active", branchOffice.Active);

                    cmd.Parameters.Add("Result", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;

                    connection.Open();

                    cmd.ExecuteNonQuery();

                    result = Convert.ToInt32(cmd.Parameters["Result"].Value);
                    message = Convert.ToString(cmd.Parameters["Message"].Value);
                }
            }
            catch (Exception e)
            {
                result = -1;
                message = $"Error: {e.Message}";
            }


            return result;
        }

        public List<Entity.BranchOffice> Read()
        {
            var branchOfficeList = new List<Entity.BranchOffice>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_branchoffice",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "R");

                    connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            branchOfficeList.Add(new Entity.BranchOffice()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Name = Convert.ToString(reader["Name"]),
                                Address = Convert.ToString(reader["Address"]),
                                Municipality = new Entity.Municipality()
                                {
                                    Id = Convert.ToInt32(reader["MunicipalityId"]),
                                    Name = Convert.ToString(reader["Municipality"]),
                                    Department = new Entity.Department()
                                    {
                                        Id = Convert.ToInt32(reader["DepartmentId"]),
                                        Name = Convert.ToString(reader["Department"]),
                                        Active = Convert.ToBoolean(reader["DepartmentActive"])
                                    },
                                    Active = Convert.ToBoolean(reader["DepartmentActive"])
                                },
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

        public bool Update(Entity.BranchOffice branchOffice, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_branchoffice",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "U");

                    cmd.Parameters.AddWithValue("Id", branchOffice.Id);
                    cmd.Parameters.AddWithValue("Name", branchOffice.Name);
                    cmd.Parameters.AddWithValue("Address", branchOffice.Address);
                    cmd.Parameters.AddWithValue("MunicipalityId", branchOffice.Municipality.Id);
                    cmd.Parameters.AddWithValue("Active", branchOffice.Active);

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;

                    connection.Open();

                    cmd.ExecuteNonQuery();

                    result = Convert.ToBoolean(cmd.Parameters["Result"].Value);
                    message = Convert.ToString(cmd.Parameters["Message"].Value);
                }
            }
            catch (Exception e)
            {
                result = false;
                message = $"Error: {e.Message}";
            }

            return result;
        }

        public bool Delete(Entity.BranchOffice branchOffice, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_branchoffice",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "D");

                    cmd.Parameters.AddWithValue("Id", branchOffice.Id);

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;

                    connection.Open();

                    cmd.ExecuteNonQuery();

                    result = Convert.ToBoolean(cmd.Parameters["Result"].Value);
                    message = Convert.ToString(cmd.Parameters["Message"].Value);
                }
            }
            catch (Exception e)
            {
                result = false;
                message = $"Error: {e.Message}";
            }

            return result;
        }
    }
}
