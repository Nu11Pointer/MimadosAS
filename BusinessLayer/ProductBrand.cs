using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class ProductBrand
    {
        private readonly Data.ProductBrand _Db = new Data.ProductBrand();

        public bool Create(Entity.ProductBrand productBrand, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(productBrand.Name) || string.IsNullOrWhiteSpace(productBrand.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Create(productBrand, out message);
        }

        public List<Entity.ProductBrand> Read()
        {
            return _Db.Read();
        }

        public bool Update(Entity.ProductBrand productBrand, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(productBrand.Name) || string.IsNullOrWhiteSpace(productBrand.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Update(productBrand, out message);
        }

        public bool Delete(Entity.ProductBrand productBrand, out string message)
        {
            return _Db.Delete(productBrand, out message);
        }
    }
}
