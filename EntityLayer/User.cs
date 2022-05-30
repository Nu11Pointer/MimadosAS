using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityLayer
{
    public class User
    {
        public Employee Employee { get; set; }

        public EmployeeEmail EmployeeEmail { get; set; }

        public string Password { get; set; }

        public bool Active { get; set; }
    }
}
