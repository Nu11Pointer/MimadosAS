﻿using System.Collections.Generic;
using System.Linq;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class BranchOfficePhone
    {
        private Data.BranchOfficePhone _Db = new Data.BranchOfficePhone();

        public bool Create(Entity.BranchOfficePhone branchOfficePhone, out string message)
        {
            return _Db.Create(branchOfficePhone, out message);
        }

        public List<Entity.BranchOfficePhone> Read()
        {
            return _Db.Read();
        }

        public List<Entity.BranchOfficePhone> ReadByBranchOffice(int branchOfficeId)
        {
            return _Db.Read().Where(m => m.BranchOffice.Id == branchOfficeId).ToList();
        }

        public bool Update(Entity.BranchOfficePhone branchOfficePhone, out string message)
        {
            return _Db.Update(branchOfficePhone, out message);
        }

        public bool Delete(Entity.BranchOfficePhone branchOfficePhone, out string message)
        {
            return _Db.Delete(branchOfficePhone, out message);
        }
    }
}
