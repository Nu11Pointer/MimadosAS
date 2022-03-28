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
    public class Customer
    {
        public bool Create(Entity.Customer customer, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_customer",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "C");

                    cmd.Parameters.AddWithValue("IdentityCard", customer.IdentityCard);
                    cmd.Parameters.AddWithValue("Name", customer.Name);
                    cmd.Parameters.AddWithValue("SurName", customer.SurName);
                    cmd.Parameters.AddWithValue("Address", customer.Address);
                    cmd.Parameters.AddWithValue("MunicipalityId", customer.Municipality.Id);
                    cmd.Parameters.AddWithValue("Active", customer.Active);

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

        public List<Entity.Customer> Read()
        {
            var customerList = new List<Entity.Customer>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_customer",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "R");

                    connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            customerList.Add(new Entity.Customer()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                IdentityCard = Convert.ToString(reader["IdentityCard"]),
                                Name = Convert.ToString(reader["Name"]),
                                SurName = Convert.ToString(reader["SurName"]),
                                Address = Convert.ToString(reader["Address"]),
                                Municipality = new Entity.Municipality()
                                {
                                    Id = Convert.ToInt32(reader["MunicipalityId"]),
                                    Department = new Entity.Department()
                                    {
                                        Id = Convert.ToInt32(reader["DepartmentId"]),
                                        Name = Convert.ToString(reader["Department"]),
                                        Active = Convert.ToBoolean(reader["DepartmentActive"])
                                    },
                                    Name = Convert.ToString(reader["Municipality"]),
                                    Active = Convert.ToBoolean(reader["MunicipalityActive"])
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
            return customerList;
        }

        public bool Update(Entity.Customer customer, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_customer",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "U");

                    cmd.Parameters.AddWithValue("Id", customer.Id);
                    cmd.Parameters.AddWithValue("IdentityCard", customer.IdentityCard);
                    cmd.Parameters.AddWithValue("Name", customer.Name);
                    cmd.Parameters.AddWithValue("SurName", customer.SurName);
                    cmd.Parameters.AddWithValue("Address", customer.Address);
                    cmd.Parameters.AddWithValue("MunicipalityId", customer.Municipality.Id);
                    cmd.Parameters.AddWithValue("Active", customer.Active);

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

        public bool Delete(Entity.Customer customer, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "sp_customer",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "D");

                    cmd.Parameters.AddWithValue("Id", customer.Id);

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
