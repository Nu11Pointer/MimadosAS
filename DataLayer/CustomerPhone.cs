using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class CustomerPhone
    {
        public bool Create(Entity.CustomerPhone customerPhone, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_customerphone",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "C");

                    cmd.Parameters.AddWithValue("CustomerId", customerPhone.Customer.Id);
                    cmd.Parameters.AddWithValue("PhoneNumber", customerPhone.PhoneNumber);
                    cmd.Parameters.AddWithValue("Active", customerPhone.Active);

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

        public List<Entity.CustomerPhone> Read()
        {
            var phoneList = new List<Entity.CustomerPhone>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_customerphone",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "R");

                    connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            phoneList.Add(new Entity.CustomerPhone()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Customer = new Entity.Customer()
                                {
                                    Id = Convert.ToInt32(reader["CustomerId"]),
                                    Name = Convert.ToString(reader["CustomerName"]),
                                    SurName = Convert.ToString(reader["CustomerSurName"])
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
            return phoneList;
        }

        public bool Update(Entity.CustomerPhone customerPhone, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_customerphone",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "U");

                    cmd.Parameters.AddWithValue("Id", customerPhone.Id);
                    cmd.Parameters.AddWithValue("CustomerId", customerPhone.Customer.Id);
                    cmd.Parameters.AddWithValue("PhoneNumber", customerPhone.PhoneNumber);
                    cmd.Parameters.AddWithValue("Active", customerPhone.Active);

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

        public bool Delete(Entity.CustomerPhone customerPhone, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_customerphone",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "D");

                    cmd.Parameters.AddWithValue("Id", customerPhone.Id);

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
