var customerTable;
var customerObj;
var rowSelected;

function SetUp() {

    $('#CollapseMenuCustomer').addClass('active');
    $('#collapseTwo').addClass('show');
    $('#CollapseMenuItemCustomer').addClass('active');

    // Show DataTable
    Read();
    DeparmentLoad();
    Validator();

    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);
}

function ShowCreateModal() {
    $("#IdentitityCardCreate").val("");
    $("#NameCreate").val("");
    $("#SurNameCreate").val("");
    $("#ActiveCreate").val(1);
    $("#DepartmentCreate").val($("#DepartmentCreate option:first").val());
    $("#MunicipalityCreate").val($("#MunicipalityCreate option:first").val());
    $("#AddressCreate").val("");
    $("#FormModalCreate").modal("show"); 
    $("#ErrorCreate").hide();
}

function DeparmentLoad() {
    // Load Selector Department
    jQuery.ajax({
        url: '/Deparment/DeparmentRead',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    }).done(MunicipalityOnChange);
}

function MunicipalityOnChange() {

    $("#MunicipalityCreate option").remove();
    $("#MunicipalityUpdate option").remove();

    // Load Selector Municipality
    jQuery.ajax({
        url: '/Municipality/ReadByDepartment',
        type: "POST",
        data: JSON.stringify({ deparmentId: $("#DepartmentCreate option:selected").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#MunicipalityCreate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
    jQuery.ajax({
        url: '/Municipality/ReadByDepartment',
        type: "POST",
        data: JSON.stringify({ deparmentId: $("#DepartmentUpdate option:selected").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#MunicipalityUpdate");
                try {
                    if (customerObj.Municipality.Id != -1) {
                        $("#MunicipalityUpdate").val(customerObj.Municipality.Id);
                        customerObj.Municipality.Id = -1;
                    }
                } catch (e) {}
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function Validator() {
    $("#CreateForm").validate({
        rules: {
            NameCreate: {
                required: true
            },
            SurNameCreate: {
                required: true
            },
            AddressCreate: {
                required: true
            }
        },
        messages: {
            NameCreate: "- El campo \"Nombre\" es obligatorio.",
            SurNameCreate: "- El campo \"Apellido\" es obligatorio.",
            AddressCreate: "- El campo \"Dirección\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateForm").validate({
        rules: {
            NameUpdate: {
                required: true
            },
            AddressUpdate: {
                required: true
            }
        },
        messages: {
            NameUpdate: "- El campo \"Nombre\" es obligatorio.",
            SurNameCreate: "- El campo \"Apellido\" es obligatorio.",
            AddressUpdate: "- El campo \"Dirección\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function ShowUpdateModal() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    customerObj = customerTable.row(rowSelected).data();

    $("#IdentitityCardUpdate").val(customerObj.IdentityCard);
    $("#NameUpdate").val(customerObj.Name);
    $("#SurNameUpdate").val(customerObj.SurName);
    $("#ActiveUpdate").val(customerObj.Active ? 1 : 0);
    $("#DepartmentUpdate").val(customerObj.Municipality.Department.Id);
    $("#DepartmentUpdate").trigger("change");
    $("#AddressUpdate").val(customerObj.Address);
    $("#FormModalUpdate").modal("show"); 
    $("#ErrorUpdate").hide();
}

function Read() {
    customerTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Customer/ReadCustomers',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            //{ "data": "IdentityCard" },
            { "data": "Name" },
            { "data": "SurName" },
            { "data": "Municipality.Department.Name"},
            { "data": "Municipality.Name" }, 
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h5><span class="badge badge-success">Habilitado</span></h5>';
                    else
                        return '<h5><span class="badge badge-danger">Deshabilitado</span></h5>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>' +
                    '<button type="button" class="btn btn-success btn-circle btn-sm btn-phone mr-1 mb-1"><i class="fas fa-phone-alt"></i></button>' +
                    '<button type="button" class="btn btn-info btn-circle btn-sm btn-email mr-1 mb-1"><i class="fas fa-envelope"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function Create() {

    if (!$("#CreateForm").valid()) {
        return;
    }

    customerObj = {
        "IdentityCard": $("#IdentitityCardCreate").val(),
        "Name": $("#NameCreate").val(),
        "SurName": $("#SurNameCreate").val(),
        "Address": $("#AddressCreate").val(),
        "Municipality": {
            "Id": $("#MunicipalityCreate option:selected").val()
        },
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Customer/CreateCustomer',
        type: "POST",
        data: JSON.stringify({ customer: customerObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            console.log(response);
            customerTable.ajax.reload();
            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalCreate").modal("hide");
                customerTable.ajax.reload();
            }
            else {
                swal("No Se Logró Crear El Cliente.", response.message, "error");
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    customerObj = {
        "Id": customerObj.Id,
        "IdentityCard": $("#IdentitityCardUpdate").val(),
        "Name": $("#NameUpdate").val(),
        "SurName": $("#SurNameUpdate").val(),
        "Address": $("#AddressUpdate").val(),
        "Municipality": {
            "Id": $("#MunicipalityUpdate option:selected").val()
        },
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Customer/UpdateCustomer',
        type: "POST",
        data: JSON.stringify({ customer: customerObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalUpdate").modal("hide");
                customerTable.ajax.reload();
            }
            else {
                swal("No Se Logró Actualizar el cliente.", response.message, "error");
            }
        },
        error: function (error) {

            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function Delete() {
    console.log("aqui esto")

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    customerObj = customerTable.row(rowSelected).data();

    swal({
        title: "Eliminar Cliente",
        text: "¿Estas Seguro que Deseas Eliminar Este Cliente?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function () {

            jQuery.ajax({
                url: '/Customer/DeleteCustomer',
                type: "POST",
                data: JSON.stringify({ customer: customerObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        customerTable.ajax.reload();
                    }
                    else {
                        swal("No Se Logró Eliminar el cliente.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        });
}

document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});