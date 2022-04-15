using System.Collections.Generic;
using Entity = EntityLayer;
using Data = DataLayer;

namespace BusinessLayer
{
    public class Customer
    {
        private Data.Customer _db = new Data.Customer();

        public bool Create(Entity.Customer customer, out string message)
        {
            // Check IdentityCard
            if (string.IsNullOrEmpty(customer.IdentityCard) || string.IsNullOrWhiteSpace(customer.IdentityCard))
            {
                message = "El campo \"Identificación\" no puede ser vacio.";
                return false;
            }

            // Check Length IdentityCard
            if (customer.IdentityCard.Length != 16)
            {
                message = "El campo \"Identificación\" debe tener 16 caracteres.";
                return false;
            }

            // Check Name
            if (string.IsNullOrEmpty(customer.Name) || string.IsNullOrWhiteSpace(customer.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            // Check SurName
            if (string.IsNullOrEmpty(customer.SurName) || string.IsNullOrWhiteSpace(customer.SurName))
            {
                message = "El campo \"Apellido\" no puede ser vacio.";
                return false;
            }

            // Check Address
            if (string.IsNullOrEmpty(customer.Address) || string.IsNullOrWhiteSpace(customer.Address))
            {
                message = "El campo \"Dirección\" no puede ser vacio.";
                return false;
            }

            return _db.Create(customer, out message);
        }

        public List<Entity.Customer> Read()
        {
            return _db.Read();
        }

        public bool Update(Entity.Customer customer, out string message)
        {
            // Check IdentityCard
            if (string.IsNullOrEmpty(customer.IdentityCard) || string.IsNullOrWhiteSpace(customer.IdentityCard))
            {
                message = "El campo \"Identificación\" no puede ser vacio.";
                return false;
            }

            // Check Length IdentityCard
            if (customer.IdentityCard.Length != 16)
            {
                message = "El campo \"Identificación\" debe tener 16 caracteres.";
                return false;
            }

            // Check Name
            if (string.IsNullOrEmpty(customer.Name) || string.IsNullOrWhiteSpace(customer.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            // Check SurName
            if (string.IsNullOrEmpty(customer.SurName) || string.IsNullOrWhiteSpace(customer.SurName))
            {
                message = "El campo \"Apellido\" no puede ser vacio.";
                return false;
            }

            // Check Address
            if (string.IsNullOrEmpty(customer.Address) || string.IsNullOrWhiteSpace(customer.Address))
            {
                message = "El campo \"Dirección\" no puede ser vacio.";
                return false;
            }

            return _db.Update(customer, out message);
        }

        public bool Delete(Entity.Customer customer, out string message)
        {
            return _db.Delete(customer, out message);
        }
    }
}
