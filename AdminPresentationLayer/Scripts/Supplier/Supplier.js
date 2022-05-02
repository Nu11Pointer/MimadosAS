// Variables Globales
var rowSelected;
var supplierTable;
var supplierObj;
var phoneTable;
var phoneObj;
var emailTable;
var emailObj;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    $('#CollapseMenuSupplier').addClass('active');
    $('#collapseSix').addClass('show');
    $('#CollapseMenuItemSupplier').addClass('active');

    // Show DataTable
    Read();

    // Cargar Selectores
    LoadSelectors();

    // Crear Validaciones
    Validator();
    
    // Establecer Actualizar
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);

    // Establecer Eliminar
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);

    // Phone
    $("#dataTable tbody").on("click", '.btn-phone', ShowPhone);    
    $("#dataTablePhone tbody").on("click", '.btn-update', ShowPhoneUpdate);
    $("#dataTablePhone tbody").on("click", '.btn-detelete', DeletePhone);

    // Email
    $("#dataTable tbody").on("click", '.btn-email', ShowEmail);    
    $("#dataTableEmail tbody").on("click", '.btn-update', ShowEmailUpdate);
    $("#dataTableEmail tbody").on("click", '.btn-detelete', DeleteEmail);
}

function Read() {
    supplierTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Supplier/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            { "data": "Name" },
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
                    '<button type="button" class="btn btn-info btn-circle btn-sm ms-2 btn-email mr-1 mb-1"><i class="fas fa-envelope"></i></button>' +
                    '<button type="button" class="btn btn-success btn-circle btn-sm ms-2 btn-phone mr-1 mb-1"><i class="fas fa-phone-alt"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function LoadSelectors() {

    // Load Selector Department
    jQuery.ajax({
        url: '/Deparment/Read',
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
                
            })
            try {
                if (supplierObj.Municipality.Id != -1) {
                    $("#MunicipalityUpdate").val(supplierObj.Municipality.Id);
                    supplierObj.Municipality.Id = -1;
                }
            } catch (e) { }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function ShowCreateModal() {
    $("#NameCreate").val("");
    $("#AddressCreate").val("");
    $("#DepartmentCreate").val($("#DepartmentCreate option:first").val());
    $("#DepartmentCreate").trigger("change");
    $("#ActiveCreate").val($("#ActiveCreate option:first").val());
    $("#FormModalCreate").modal("show"); 
    $("#ErrorCreate").hide();
}

function Validator() {

    // Create Custom Rules

    jQuery.validator.addMethod("phoneNumber", function (value, element) {
        return this.optional(element) || /^[0-9]{4}-[0-9]{4}$/i.test(value);
    }, "El formato correcto es ####-####");

    jQuery.validator.addMethod("email", function (value, element) {
        return this.optional(element) || /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
    }, "Debes ingresar un correo electronico valido.");

    $("#CreateForm").validate({
        rules: {
            NameCreate: {
                required: true
            }
        },
        messages: {
            NameCreate: {
                required: "- El campo \"Nombre\" es obligatorio."
            }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateForm").validate({
        rules: {
            NameUpdate: {
                required: true
            }
        },
        messages: {
            NameUpdate: {
                required: "- El campo \"Nombre\" es obligatorio."
            }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#CreatePhoneForm").validate({
        rules: {
            PhoneCreate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneCreate: { required: "- El campo \"Telefono\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdatePhoneForm").validate({
        rules: {
            PhoneUpdate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneUpdate: { required: "- El campo \"Telefono\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#CreateEmailForm").validate({
        rules: {
            EmailCreate: {
                required: true,
                email: true
            }
        },
        messages: {
            EmailCreate: {
                required: "- El campo \"Correo\" es obligatorio.",
                email: "- Porfavor ingrese un Correo valido."
            }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateEmailForm").validate({
        rules: {
            EmailUpdate: {
                required: true,
                email: true
            }
        },
        messages: {
            EmailUpdate: {
                required: "- El campo \"Correo\" es obligatorio.",
                email: "- Porfavor ingrese un Correo valido."
            }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function Create() {

    if (!$("#CreateForm").valid()) {
        return;
    }

    supplierObj = {
        "Id": 0,
        "Name": $("#NameCreate").val(),
        "Address": $("#AddressCreate").val(),
        "Municipality": {
            "Id": $("#MunicipalityCreate option:selected").val()
        },
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Supplier/Create',
        type: "POST",
        data: JSON.stringify({ supplier: supplierObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            supplierTable.ajax.reload();
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalCreate").modal("hide");
            if (response.result) {
                supplierTable.ajax.reload();
            }
            else {
                swal("No Se Logró Crear El Proveedor.", response.message, "error");
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

function ShowUpdateModal() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    supplierObj = supplierTable.row(rowSelected).data();
    $("#NameUpdate").val(supplierObj.Name);
    $("#AddressUpdate").val(supplierObj.Address);
    $("#DepartmentUpdate").val(supplierObj.Municipality.Department.Id);
    $("#DepartmentUpdate").trigger("change");
    $("#ActiveUpdate").val(supplierObj.Active ? 1 : 0);
    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    supplierObj = {
        "Id": supplierObj.Id,
        "Name": $("#NameUpdate").val(),
        "Address": $("#AddressUpdate").val(),
        "Municipality": {
            "Id": $("#MunicipalityUpdate option:selected").val()
        },
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Supplier/Update',
        type: "POST",
        data: JSON.stringify({ supplier: supplierObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");
            if (response.result) {
                supplierTable.ajax.reload();
            }
            else {
                swal("No Se Logró Actualizar el Proveedor.", response.message, "error");
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

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    supplierObj = supplierTable.row(rowSelected).data();

    swal({
        title: "Eliminar Proveedor",
        text: "¿Estas Seguro que Deseas Eliminar Este Proveedor?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: false
    },
        function () {

            jQuery.ajax({
                url: '/Supplier/Delete',
                type: "POST",
                data: JSON.stringify({ supplier: supplierObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    if (response.result) {
                        supplierTable.ajax.reload();
                        swal("Eliminado.", "El proveedor ha sido eliminado satisfactoriamente.", "success");
                    }
                    else {
                        switch (response.message) {

                            case "The DELETE statement conflicted with the REFERENCE constraint \"FK__SupplierE__Suppl__59FA5E80\". The conflict occurred in database \"MimadosDB\", table \"dbo.SupplierEmail\", column 'SupplierId'.":
                                response.message = "El proveedor tiene relaciones con otras tablas.";
                                break;

                            default:
                        }
                        swal("No Se Logró Eliminar el Proveedor.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () {
                }
            });

        }
    );
}

// Teléfono

function ShowPhone() {
    $("#FormModalPhone").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    supplierObj = supplierTable.row(rowSelected).data();

    if (phoneTable != null) {
        phoneTable.destroy();
    }

    phoneTable = $('#dataTablePhone').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/SupplierPhone/ReadByEmployeId',
            type: "POST",
            data: { employeeId: supplierObj.Id }
        },
        "columns": [
            { "data": "Id" },
            { "data": "PhoneNumber" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h4><span class="badge badge-success">Habilitado</span></h4>';
                    else
                        return '<h4><span class="badge badge-danger">Deshabilitado</span></h4>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function ShowPhoneCreate() {
    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneCreate").modal("show");

    $("#PhoneCreate").val("");
    $("#ActivePhoneCreate").val(1);
    $("#ErrorPhoneCreate").hide();
}

function CreatePhone() {

    if (!$("#CreatePhoneForm").valid()) {
        return;
    }

    phoneObj = {
        "Supplier": supplierObj,
        "PhoneNumber": $("#PhoneCreate").val(),
        "Active": $("#ActivePhoneCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/SupplierPhone/Create',
        type: "POST",
        data: JSON.stringify({ supplierPhone: phoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            
            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneCreate").modal("hide");
                $("#FormModalPhone").modal("show");
                phoneTable.ajax.reload();
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneCreate").modal("hide");
                swal({
                    title: "No Logró Añadir el Teléfono.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                function(){
                    $("#FormModalPhoneCreate").modal("show");
                });
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

function ShowPhoneUpdate() {

    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneUpdate").modal("show");
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    phoneObj = phoneTable.row(rowSelected).data();

    $("#PhoneUpdate").val(phoneObj.PhoneNumber);
    $("#ActivePhoneUpdate").val(phoneObj.Active ? 1 : 0);
    $("#ErrorPhoneUpdate").hide();
}

function UpdatePhone() {

    if (!$("#UpdatePhoneForm").valid()) {
        return;
    }

    phoneObj = {
        "Id": phoneObj.Id,
        "Supplier": supplierObj,
        "PhoneNumber": $("#PhoneUpdate").val(),
        "Active": $("#ActivePhoneUpdate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/SupplierPhone/Update',
        type: "POST",
        data: JSON.stringify({ supplierPhone: phoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            
            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneUpdate").modal("hide");
                $("#FormModalPhone").modal("show");
                phoneTable.ajax.reload();
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneUpdate").modal("hide");
                swal({
                    title: "No Logró Actualizar el Teléfono.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                function(){
                    $("#FormModalPhoneUpdate").modal("show");
                });
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

function DeletePhone() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    phoneObj = phoneTable.row(rowSelected).data();

    $("#FormModalPhone").modal("hide");

    swal({
        title: "Eliminar Teléfono",
        text: "¿Estas Seguro que Deseas Eliminar este teléfono?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function (inputValue) {

            if (!inputValue) {
                $("#FormModalPhone").modal("show");
                return
            }

            jQuery.ajax({
                url: '/SupplierPhone/Delete',
                type: "POST",
                data: JSON.stringify({ supplierPhone: phoneObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        phoneTable.ajax.reload();
                        $("#FormModalPhone").modal("show");
                    }
                    else {
                        swal("No Logró Eliminar el teléfono.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        });
}

// Correo

function ShowEmail() {
    $("#FormModalEmail").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    supplierObj = supplierTable.row(rowSelected).data();

    if (emailTable != null) {
        emailTable.destroy();
    }

    emailTable = $('#dataTableEmail').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/supplierEmail/ReadByEmployeId',
            type: "POST",
            data: { employeeId: supplierObj.Id }
        },
        "columns": [
            { "data": "Id" },
            { "data": "Email" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h4><span class="badge badge-success">Habilitado</span></h4>';
                    else
                        return '<h4><span class="badge badge-danger">Deshabilitado</span></h4>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function ShowEmailCreate() {
    $("#FormModalEmail").modal("hide");
    $("#FormModalEmailCreate").modal("show");

    $("#EmailCreate").val("");
    $("#ActiveEmailCreate").val(1);
    $("#ErrorEmailCreate").hide();
}

function CreateEmail() {

    if (!$("#CreateEmailForm").valid()) {
        return;
    }

    emailObj = {
        "Supplier": supplierObj,
        "Email": $("#EmailCreate").val(),
        "Active": $("#ActiveEmailCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/supplierEmail/Create',
        type: "POST",
        data: JSON.stringify({ supplierEmail: emailObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            
            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailCreate").modal("hide");
                $("#FormModalEmail").modal("show");
                emailTable.ajax.reload();
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailCreate").modal("hide");
                swal({
                    title: "No Logró Añadir el Correo.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                function(){
                    $("#FormModalEmailCreate").modal("show");
                });
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

function ShowEmailUpdate() {

    $("#FormModalEmail").modal("hide");
    $("#FormModalEmailUpdate").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    emailObj = emailTable.row(rowSelected).data();

    $("#EmailUpdate").val(emailObj.Email);
    $("#ActiveEmailUpdate").val(emailObj.Active ? 1 : 0);
    $("#ErrorEmailUpdate").hide();
}

function UpdateEmail() {

    if (!$("#UpdateEmailForm").valid()) {
        return;
    }

    emailObj = {
        "Id": emailObj.Id,
        "Supplier": supplierObj,
        "Email": $("#EmailUpdate").val(),
        "Active": $("#ActiveEmailUpdate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/supplierEmail/Update',
        type: "POST",
        data: JSON.stringify({ supplierEmail: emailObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            
            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailUpdate").modal("hide");
                $("#FormModalEmail").modal("show");
                emailTable.ajax.reload();
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailUpdate").modal("hide");
                swal({
                    title: "No Logró Actualizar el Correo.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                function(){
                    $("#FormModalEmailUpdate").modal("show");
                });
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

function DeleteEmail() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    emailObj = emailTable.row(rowSelected).data();

    $("#FormModalEmail").modal("hide");

    swal({
        title: "Eliminar Correo",
        text: "¿Estas Seguro que Deseas Eliminar este Correo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function (inputValue) {

            if (!inputValue) {
                $("#FormModalEmail").modal("show");
                return
            }

            jQuery.ajax({
                url: '/supplierEmail/Delete',
                type: "POST",
                data: JSON.stringify({ supplierEmail: emailObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        emailTable.ajax.reload();
                        $("#FormModalEmail").modal("show");
                    }
                    else {
                        swal("No Logró Eliminar el Correo.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        });
}