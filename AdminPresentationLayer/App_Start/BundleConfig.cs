using System.Web.Optimization;

namespace AdminPresentationLayer
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new Bundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new Bundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            // sb-admin-2

            bundles.Add(new StyleBundle("~/Content/sb-admin").Include(
                //"~/Content/DataTables/css/jquery.dataTables.css",
                "~/Content/all.min.css",
                "~/Content/google-font-nunito.css",
                "~/Content/sb-admin-2/css/sb-admin-2.min.css",
                "~/Content/sb-admin-2/vendor/datatables/dataTables.bootstrap4.min.css",
                "~/Content/DataTables/css/responsive.dataTables.css",
                "~/Content/jquery-ui.css",
                "~/Content/sweetalert.css",
                "~/Content/modal.css"
                ));

            bundles.Add(new Bundle("~/bundles/sb-admin").Include(
                "~/Scripts/jquery-{version}.js",
                //"~/Content/sb-admin-2/vendor/jquery/jquery.min.js",
                "~/Content/sb-admin-2/vendor/bootstrap/js/bootstrap.bundle.min.js",
                "~/Content/sb-admin-2/vendor/jquery-easing/jquery.easing.min.js",
                "~/Content/sb-admin-2/vendor/datatables/jquery.dataTables.min.js",
                "~/Content/sb-admin-2/vendor/datatables/dataTables.bootstrap4.min.js",
                "~/Scripts/DataTables/dataTables.responsive.js",
                "~/Scripts/sb-admin-2/js/sb-admin-2.min.js",
                "~/Scripts/loadingoverlay/loadingoverlay.min.js",
                "~/Scripts/jquery-ui.js",
                "~/Scripts/jquery.validate.js",
                "~/Scripts/sweetalert.min.js"));


        }
    }
}
