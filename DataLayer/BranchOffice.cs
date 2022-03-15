﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class BranchOffice
    {
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
                        CommandText = "sp_branchoffice_read",
                        Connection = connection
                    };

                    connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            branchOfficeList.Add(new EntityLayer.BranchOffice()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Name = Convert.ToString(reader["Name"]),
                                Address = Convert.ToString(reader["Address"]),
                                MunicipalityId = Convert.ToInt32(reader["MunicipalityId"]),
                                Active = Convert.ToBoolean(reader["Active"])
                            });
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            return branchOfficeList;
        }

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
                        CommandText = "sp_branchoffice_create",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Name", branchOffice.Name);
                    cmd.Parameters.AddWithValue("Address", branchOffice.Address);
                    cmd.Parameters.AddWithValue("MunicipalityId", branchOffice.MunicipalityId);
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
                        CommandText = "sp_branchoffice_update",
                        Connection = connection
                    };

                    cmd.Parameters.AddWithValue("Id", branchOffice.Id);
                    cmd.Parameters.AddWithValue("Name", branchOffice.Name);
                    cmd.Parameters.AddWithValue("Address", branchOffice.Address);
                    cmd.Parameters.AddWithValue("MunicipalityId", branchOffice.MunicipalityId);
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
                        CommandText = "sp_branchoffice_delete",
                        Connection = connection
                    };

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
