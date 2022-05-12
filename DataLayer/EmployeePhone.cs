using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class EmployeePhone
    {
        private readonly string _commandText = "sp_employeephone";

        public bool Create(Entity.EmployeePhone employeePhone, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _commandText,
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "C");

                    cmd.Parameters.AddWithValue("EmployeeId", employeePhone.Employee.Id);
                    cmd.Parameters.AddWithValue("PhoneNumber", employeePhone.PhoneNumber);
                    cmd.Parameters.AddWithValue("Active", employeePhone.Active);

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

        public List<Entity.EmployeePhone> Read()
        {
            var phones = new List<Entity.EmployeePhone>();

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _commandText,
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "R");

                    connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            phones.Add(new Entity.EmployeePhone()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Employee = new Entity.Employee()
                                {
                                    Id = Convert.ToInt32(reader["EmployeeId"]),
                                    Name = Convert.ToString(reader["EmployeeName"]),
                                    SurName = Convert.ToString(reader["EmployeeSurName"])
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
            return phones;
        }

        public bool Update(Entity.EmployeePhone employeePhone, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _commandText,
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "U");

                    cmd.Parameters.AddWithValue("Id", employeePhone.Id);
                    cmd.Parameters.AddWithValue("EmployeeId", employeePhone.Employee.Id);
                    cmd.Parameters.AddWithValue("PhoneNumber", employeePhone.PhoneNumber);
                    cmd.Parameters.AddWithValue("Active", employeePhone.Active);

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

        public bool Delete(Entity.EmployeePhone employeePhone, out string message)
        {
            bool result;

            try
            {
                using (var connection = new SqlConnection(Connection.value))
                {
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _commandText,
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Operation", "D");

                    cmd.Parameters.AddWithValue("Id", employeePhone.Id);

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
