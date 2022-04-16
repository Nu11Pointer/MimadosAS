using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class Employee
    {
        private readonly string _CommandText = "sp_employee";

        public bool Create(Entity.Employee employee, out string message)
        {
            bool result;

            try
            {
                // Crear Conexión
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _CommandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "C");

                    cmd.Parameters.AddWithValue("Id", employee.Id);
                    cmd.Parameters.AddWithValue("EmployeePositionId", employee.EmployeePosition.Id);
                    cmd.Parameters.AddWithValue("BranchOfficeId", employee.BranchOffice.Id);
                    cmd.Parameters.AddWithValue("IdentityCard", employee.IdentityCard);
                    cmd.Parameters.AddWithValue("Name", employee.Name);
                    cmd.Parameters.AddWithValue("SurName", employee.SurName);
                    cmd.Parameters.AddWithValue("Address", employee.Address);
                    cmd.Parameters.AddWithValue("MunicipalityId", employee.Municipality.Id);
                    cmd.Parameters.AddWithValue("Active", employee.Active);

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;


                    // Abrir Conexion
                    connection.Open();

                    // Ejecutar consulta
                    cmd.ExecuteNonQuery();

                    // Guardar el resultado y el mensaje
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

        public List<Entity.Employee> Read()
        {
            var employees = new List<Entity.Employee>();

            try
            {
                // Crear Conección
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar Consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _CommandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "R");

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;

                    // Abrir Conexión
                    connection.Open();

                    // Ejecutar la Consulta
                    using (var reader = cmd.ExecuteReader())
                    {
                        // Leer cada fila de la tabla
                        while (reader.Read())
                        {
                            // Añadir Cada Elemento a La Lista
                            employees.Add(new Entity.Employee()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                EmployeePosition = new Entity.EmployeePosition()
                                {
                                    Id = Convert.ToInt32(reader["EmployeePositionId"]),
                                    Name = reader["EmployeePosition"].ToString(),
                                    Active = Convert.ToBoolean(reader["EmployeePositionActive"])
                                },
                                BranchOffice = new Entity.BranchOffice()
                                {
                                    Id = Convert.ToInt32(reader["BranchOfficeId"]),
                                    Name = reader["BranchOffice"].ToString(),
                                    Active = Convert.ToBoolean(reader["BranchOfficeActive"])
                                },
                                IdentityCard = reader["IdentityCard"].ToString(),
                                Name = reader["Name"].ToString(),
                                SurName = reader["SurName"].ToString(),
                                FullName = reader["FullName"].ToString(),
                                Address = reader["Address"].ToString(),
                                Municipality = new Entity.Municipality()
                                {
                                    Id = Convert.ToInt32(reader["MunicipalityId"]),
                                    Department = new Entity.Department()
                                    {
                                        Id = Convert.ToInt32(reader["DepartmentId"]),
                                        Name = reader["Department"].ToString(),
                                        Active = Convert.ToBoolean(reader["DepartmentActive"])
                                    },
                                    Name = reader["Municipality"].ToString(),
                                    Active = Convert.ToBoolean(reader["MunicipalityActive"])
                                },
                                Active = Convert.ToBoolean(reader["Active"])
                            });
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            return employees;
        }

        public bool Update(Entity.Employee employee, out string message)
        {
            bool result;

            try
            {
                // Crear Conexión
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _CommandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "U");

                    cmd.Parameters.AddWithValue("Id", employee.Id);
                    cmd.Parameters.AddWithValue("EmployeePositionId", employee.EmployeePosition.Id);
                    cmd.Parameters.AddWithValue("BranchOfficeId", employee.BranchOffice.Id);
                    cmd.Parameters.AddWithValue("IdentityCard", employee.IdentityCard);
                    cmd.Parameters.AddWithValue("Name", employee.Name);
                    cmd.Parameters.AddWithValue("SurName", employee.SurName);
                    cmd.Parameters.AddWithValue("Address", employee.Address);
                    cmd.Parameters.AddWithValue("MunicipalityId", employee.Municipality.Id);
                    cmd.Parameters.AddWithValue("Active", employee.Active);

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;


                    // Abrir Conexion
                    connection.Open();

                    // Ejecutar consulta
                    cmd.ExecuteNonQuery();

                    // Guardar el resultado y el mensaje
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

        public bool Delete(Entity.Employee employee, out string message)
        {
            bool result;

            try
            {
                // Crear Conexión
                using (var connection = new SqlConnection(Connection.value))
                {
                    // Configurar consulta
                    var cmd = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = _CommandText,
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("Operation", "U");

                    cmd.Parameters.AddWithValue("Id", employee.Id);
                    cmd.Parameters.AddWithValue("EmployeePositionId", employee.EmployeePosition.Id);
                    cmd.Parameters.AddWithValue("BranchOfficeId", employee.BranchOffice.Id);
                    cmd.Parameters.AddWithValue("IdentityCard", employee.IdentityCard);
                    cmd.Parameters.AddWithValue("Name", employee.Name);
                    cmd.Parameters.AddWithValue("SurName", employee.SurName);
                    cmd.Parameters.AddWithValue("Address", employee.Address);
                    cmd.Parameters.AddWithValue("MunicipalityId", employee.Municipality.Id);
                    cmd.Parameters.AddWithValue("Active", employee.Active);

                    cmd.Parameters.Add("Result", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Message", SqlDbType.VarChar, 250).Direction = ParameterDirection.Output;


                    // Abrir Conexion
                    connection.Open();

                    // Ejecutar consulta
                    cmd.ExecuteNonQuery();

                    // Guardar el resultado y el mensaje
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
