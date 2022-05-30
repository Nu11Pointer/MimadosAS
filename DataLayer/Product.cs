using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Entity = EntityLayer;

namespace DataLayer
{
    public class Product
    {
        private readonly string _CommandText = "sp_product";

        public bool Create(Entity.Product product, out string message)
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

                    cmd.Parameters.AddWithValue("Id", product.Id);
                    cmd.Parameters.AddWithValue("ProductBrandId", product.ProductBrand.Id);
                    cmd.Parameters.AddWithValue("ProductCategoryId", product.ProductCategory.Id);
                    cmd.Parameters.AddWithValue("ProductPackagingId", product.ProductPackaging.Id);
                    cmd.Parameters.AddWithValue("ProductMeasurementUnitId", product.ProductMeasurementUnit.Id);
                    cmd.Parameters.AddWithValue("Name", product.Name);
                    cmd.Parameters.AddWithValue("SalePrice", product.SalePrice);
                    cmd.Parameters.AddWithValue("Stock", product.Stock);
                    cmd.Parameters.AddWithValue("Description", product.Description);
                    cmd.Parameters.AddWithValue("NetContent", product.NetContent);
                    cmd.Parameters.AddWithValue("Active", product.Active);

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

        public List<Entity.Product> Read()
        {
            var deparmentList = new List<Entity.Product>();

            try
            {
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
                            deparmentList.Add(new Entity.Product()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Name = Convert.ToString(reader["Name"]),
                                ProductBrand = new Entity.ProductBrand()
                                {
                                    Id = Convert.ToInt32(reader["ProductBrandId"]),
                                    Name = reader["ProductBrand"].ToString(),
                                    Active = Convert.ToBoolean(reader["ProductBrandActive"])
                                },
                                ProductCategory = new Entity.ProductCategory()
                                {
                                    Id = Convert.ToInt32(reader["ProductCategoryId"]),
                                    Name = reader["ProductCategory"].ToString(),
                                    Active = Convert.ToBoolean(reader["ProductCategoryActive"])
                                },
                                ProductPackaging = new Entity.ProductPackaging()
                                {
                                    Id = Convert.ToInt32(reader["ProductPackagingId"]),
                                    Name = reader["ProductPackaging"].ToString(),
                                    Active = Convert.ToBoolean(reader["ProductPackagingActive"])
                                },
                                ProductMeasurementUnit = new Entity.ProductMeasurementUnit()
                                {
                                    Id = Convert.ToInt32(reader["ProductMeasurementUnitId"]),
                                    Name = reader["ProductMeasurementUnit"].ToString(),
                                    Symbol = reader["ProductMeasurementUnitSymbol"].ToString(),
                                    Active = Convert.ToBoolean(reader["ProductMeasurementUnitActive"])
                                },
                                Description = Convert.ToString(reader["Description"]),
                                SalePrice = Convert.ToDecimal(reader["SalePrice"]),
                                NetContent = Convert.ToDecimal(reader["NetContent"]),
                                Stock = Convert.ToInt32(reader["Stock"]),
                                Active = Convert.ToBoolean(reader["Active"])
                            });
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            return deparmentList;
        }

        public bool Update(Entity.Product product, out string message)
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

                    cmd.Parameters.AddWithValue("Id", product.Id);
                    cmd.Parameters.AddWithValue("ProductBrandId", product.ProductBrand.Id);
                    cmd.Parameters.AddWithValue("ProductCategoryId", product.ProductCategory.Id);
                    cmd.Parameters.AddWithValue("ProductPackagingId", product.ProductPackaging.Id);
                    cmd.Parameters.AddWithValue("ProductMeasurementUnitId", product.ProductMeasurementUnit.Id);
                    cmd.Parameters.AddWithValue("Name", product.Name);
                    cmd.Parameters.AddWithValue("SalePrice", product.SalePrice);
                    cmd.Parameters.AddWithValue("Stock", product.Stock);
                    cmd.Parameters.AddWithValue("Description", product.Description);
                    cmd.Parameters.AddWithValue("NetContent", product.NetContent);
                    cmd.Parameters.AddWithValue("Active", product.Active);

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

        public bool Delete(Entity.Product product, out string message)
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
                    cmd.Parameters.AddWithValue("Operation", "D");

                    cmd.Parameters.AddWithValue("Id", product.Id);
                    cmd.Parameters.AddWithValue("Name", product.Name);
                    cmd.Parameters.AddWithValue("Active", product.Active);

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

        public bool StockControl(int idProduct, int quantity)
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
                        CommandText = "sp_stock_control",
                        Connection = connection
                    };

                    // Establecer Parametros
                    cmd.Parameters.AddWithValue("IdProduct", idProduct);
                    cmd.Parameters.AddWithValue("Quantity", quantity);

                    // Abrir Conexion
                    connection.Open();

                    // Ejecutar consulta
                    result = cmd.ExecuteNonQuery() != 0;
                }
            }
            catch (Exception)
            {
                result = false;
            }
            return result;
        }
    }
}
