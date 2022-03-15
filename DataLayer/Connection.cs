using System.Configuration;

namespace DataLayer
{
    public class Connection
    {
        public static string value = ConfigurationManager.ConnectionStrings["MimadosDB"].ToString();
    }
}
