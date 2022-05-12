using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class EmployeeEmail
    {
        private readonly string _commandText = "sp_employeeemail";

        public bool Create(Entity.EmployeeEmail employeeEmail, out string message)
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

                    cmd.Parameters.AddWithValue("EmployeeId", employeeEmail.Employee.Id);
                    cmd.Parameters.AddWithValue("Email", employeeEmail.Email);
                    cmd.Parameters.AddWithValue("Active", employeeEmail.Active);

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

        public List<Entity.EmployeeEmail> Read()
        {
            var emails = new List<Entity.EmployeeEmail>();

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
                            emails.Add(new Entity.EmployeeEmail()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Employee = new Entity.Employee()
                                {
                                    Id = Convert.ToInt32(reader["EmployeeId"]),
                                    Name = Convert.ToString(reader["EmployeeName"]),
                                    SurName = Convert.ToString(reader["EmployeeSurName"])
                                },
                                Email = Convert.ToString(reader["Email"]),
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
            return emails;
        }

        public bool Update(Entity.EmployeeEmail employeeEmail, out string message)
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

                    cmd.Parameters.AddWithValue("Id", employeeEmail.Id);
                    cmd.Parameters.AddWithValue("EmployeeId", employeeEmail.Employee.Id);
                    cmd.Parameters.AddWithValue("Email", employeeEmail.Email);
                    cmd.Parameters.AddWithValue("Active", employeeEmail.Active);

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

        public bool Delete(Entity.EmployeeEmail employeeEmail, out string message)
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

                    cmd.Parameters.AddWithValue("Id", employeeEmail.Id);

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
