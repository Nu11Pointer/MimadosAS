var user;
var firsTime = true;

document.addEventListener('DOMContentLoaded', function () {
    jQuery.ajax({
        url: '/User/Me',
        type: "GET",
        success: function (data) {
            user = data;
            $("#UserName").text(user.Employee.Name + " (" + user.Employee.EmployeePosition.Name + ")")
            if (user.Employee.EmployeePosition.Name == "Administrador") {
                $("#nav-Dashboard").show();
                $("#nav-BranchOffice").show();
                $("#nav-Employee").show();
                $("#CollapseMenuProducts").show();
                $("#CollapseMenuSupplier").show();
                $("#nav-Customer").show();
                $("#CollapseMenuSales").show();
                $("#nav-User").show();
            }  
            if (user.Employee.EmployeePosition.Name == "Gerente") {
                $("#nav-Dashboard").hide();
                $("#nav-BranchOffice").hide();
                $("#nav-Employee").show();
                $("#CollapseMenuProducts").show();
                $("#CollapseMenuSupplier").show();
                $("#nav-Customer").show();
                $("#CollapseMenuSales").show();
                $("#nav-User").hide();
            }
            if (user.Employee.EmployeePosition.Name == "Vendedor") {
                $("#nav-Dashboard").hide();
                $("#nav-BranchOffice").hide();
                $("#nav-Employee").hide();
                $("#CollapseMenuProducts").hide();
                $("#CollapseMenuSupplier").hide();
                $("#nav-Customer").show();
                $("#CollapseMenuSales").show();
                $("#nav-User").hide();
            }
            if (user.Employee.EmployeePosition.Name == "Bodeguero") {
                $("#nav-Dashboard").hide();
                $("#nav-BranchOffice").hide();
                $("#nav-Employee").hide();
                $("#CollapseMenuProducts").show();
                $("#CollapseMenuSupplier").show();
                $("#nav-Customer").hide();
                $("#CollapseMenuSales").hide();
                $("#nav-User").hide();
            }
        },
        error: function (_) {
        }
    });
});
