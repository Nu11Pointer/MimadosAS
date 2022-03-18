using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity = EntityLayer;
using Data = DataLayer;

namespace BusinessLayer
{
    public class BranchOfficePhone
    {
        private Data.BranchOfficePhone _Db = new Data.BranchOfficePhone();

        public List<Entity.BranchOfficePhone> Read()
        {
            return _Db.Read();
        }

        public List<Entity.BranchOfficePhone> ReadByBranchOffice(int branchOfficeId)
        {
            return _Db.Read().Where(m => m.BranchOffice.Id == branchOfficeId).ToList();
        }
    }
}
