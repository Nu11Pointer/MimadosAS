using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class BranchOfficePhone
    {
        public bool Create(Entity.BranchOfficePhone branchOfficePhone, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_branchofficephone",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "C");

                    cmd.Parameters.AddWithValue("BranchOfficeId", branchOfficePhone.BranchOffice.Id);
                    cmd.Parameters.AddWithValue("PhoneNumber", branchOfficePhone.PhoneNumber);
                    cmd.Parameters.AddWithValue("Active", branchOfficePhone.Active);

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
                message = e.Message;
            }

            return result;
        }

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
                        CommandText = "sp_branchofficephone",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "R");

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

        public bool Update(Entity.BranchOfficePhone branchOfficePhone, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_branchofficephone",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "U");

                    cmd.Parameters.AddWithValue("Id", branchOfficePhone.Id);
                    cmd.Parameters.AddWithValue("BranchOfficeId", branchOfficePhone.BranchOffice.Id);
                    cmd.Parameters.AddWithValue("PhoneNumber", branchOfficePhone.PhoneNumber);
                    cmd.Parameters.AddWithValue("Active", branchOfficePhone.Active);

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
                message = e.Message;
            }

            return result;
        }

        public bool Delete(Entity.BranchOfficePhone branchOfficePhone, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_branchofficephone",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "D");

                    cmd.Parameters.AddWithValue("Id", branchOfficePhone.Id);

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
                message = e.Message;
            }

            return result;
        }
    }
}
