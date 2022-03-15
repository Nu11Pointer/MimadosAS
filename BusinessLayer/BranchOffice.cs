using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class BranchOffice
    {
        private Data.BranchOffice _Db = new Data.BranchOffice();

        public List<Entity.BranchOffice> Read()
        {
            return _Db.Read();
        }

        public int Create(Entity.BranchOffice branchOffice, out string message)
        {
            // Check Name
            if (string.IsNullOrEmpty(branchOffice.Name) || string.IsNullOrWhiteSpace(branchOffice.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return -1;
            }

            // Check Address
            if (string.IsNullOrEmpty(branchOffice.Address) || string.IsNullOrWhiteSpace(branchOffice.Address))
            {
                message = "El campo \"Dirección\" no puede ser vacio.";
                return -1;
            }

            return _Db.Create(branchOffice, out message);
        }

        public bool Update(Entity.BranchOffice branchOffice, out string message)
        {
            // Check Name
            if (string.IsNullOrEmpty(branchOffice.Name) || string.IsNullOrWhiteSpace(branchOffice.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            // Check Address
            if (string.IsNullOrEmpty(branchOffice.Address) || string.IsNullOrWhiteSpace(branchOffice.Address))
            {
                message = "El campo \"Dirección\" no puede ser vacio.";
                return false;
            }

            return _Db.Update(branchOffice, out message);
        }

        public bool Delete(Entity.BranchOffice branchOffice, out string message)
        {
            return _Db.Delete(branchOffice, out message);
        }
    }
}
