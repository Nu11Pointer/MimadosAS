// Variables Globales
var rowSelected;
var departmentTable;
var departmentObj;
var municipalityObj;
var municipalityTable;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    $('#CollapseMenuUbication').addClass('active');
    $('#collapseThree').addClass('show');
    $('#CollapseMenuItemDepartment').addClass('active');

    // Show DataTable
    Read();


    // Crear Validaciones
    Validator();

    // Establecer Actualizar
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);

    // Establecer Eliminar
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);

    // Municipality
    $("#dataTable tbody").on("click", '.btn-municipality', ShowMunicipality);
    $("#dataTableMunicipality tbody").on("click", '.btn-update', ShowMunicipalityUpdate);
    $("#dataTableMunicipality tbody").on("click", '.btn-detelete', DeleteMunicipality);
}

function Read() {
    departmentTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Deparment/Read',
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
                    '<button type="button" class="btn btn-success btn-circle btn-sm btn-municipality mr-1 mb-1"><i class="fas fa-location-crosshairs"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function ShowCreateModal() {
    $("#NameCreate").val("");
    $("#ActiveCreate").val(1);
    $("#FormModalCreate").modal("show"); 
    $("#ErrorCreate").hide();
}

function Validator() {
    $("#CreateForm").validate({
        rules: {
            NameCreate: {
                required: true
            }
        },
        messages: {
            NameCreate: "- El campo \"Nombre\" es obligatorio."
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
            NameUpdate: "- El campo \"Nombre\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#CreateMunicipalityForm").validate({
        rules: {
            MunicipalityNameCreate: {
                required: true
            }
        },
        messages: {
            MunicipalityNameCreate: "- El campo \"Nombre\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateMunicipalityForm").validate({
        rules: {
            MunicipalityNameUpdate: {
                required: true
            }
        },
        messages: {
            NameUpdate: "- El campo \"Nombre\" es obligatorio."
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

    departmentObj = {
        "Id": 0,
        "Name": $("#NameCreate").val(),
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Deparment/Create',
        type: "POST",
        data: JSON.stringify({ department: departmentObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            departmentTable.ajax.reload();
            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalCreate").modal("hide");
                departmentTable.ajax.reload();
            }
            else {
                swal("No Se Logró Crear El Departamento.", response.message, "error");
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

    deparmentObj = departmentTable.row(rowSelected).data();

    $("#NameUpdate").val(deparmentObj.Name);
    $("#ActiveUpdate").val(deparmentObj.Active ? 1 : 0);
    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        productCategoryObj
    }

    deparmentObj = {
        "Id": deparmentObj.Id,
        "Name": $("#NameUpdate").val(),
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Deparment/Update',
        type: "POST",
        data: JSON.stringify({ department: deparmentObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalUpdate").modal("hide");
                departmentTable.ajax.reload();
            }
            else {
                swal("No Se Logró Actualizar el departamento.", response.message, "error");
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

    deparmentObj = departmentTable.row(rowSelected).data();

    swal({
        title: "Eliminar Departamento",
        text: "¿Estas Seguro que Deseas Eliminar Este Departamento?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function () {

            jQuery.ajax({
                url: '/Deparment/Delete',
                type: "POST",
                data: JSON.stringify({ department: deparmentObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        departmentTable.ajax.reload();
                    }
                    else {
                        swal("No Se Logró Eliminar el departamento.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        }
    );
}

function ShowMunicipality() {
    $("#FormModalMunicipality").modal("show");

    var rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    deparmentObj = departmentTable.row(rowSelected).data();

    if (municipalityTable != null) {
        municipalityTable.destroy();
    }

    console.log({ deparmentId: deparmentObj.Id })

    municipalityTable = $('#dataTableMunicipality').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Municipality/ReadByDepartment',
            type: "POST",
            data: { deparmentId: deparmentObj.Id }
        },
        "columns": [
            { "data": "Id" },
            { "data": "Name" },
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

function ShowMunicipalityCreate() {
    $("#FormModalMunicipality").modal("hide");
    $("#FormModalMunicipalityCreate").modal("show");

    $("#MunicipalityNameCreate").val("");
    $("#ActiveMunicipalityCreate").val(1);
    $("#ErrorMunicipalityCreate").hide();
}

function CreateMunicipality() {

    if (!$("#CreateMunicipalityForm").valid()) {
        return;
    }

    municipalityObj = {
        "Id": 0,
        "Department": deparmentObj,
        "Name": $("#MunicipalityNameCreate").val(),
        "Active": $("#ActiveMunicipalityCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/Municipality/Create',
        type: "POST",
        data: JSON.stringify({ municipality: municipalityObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.result) {
                municipalityTable.ajax.reload();
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalMunicipalityCreate").modal("hide");
                $("#FormModalMunicipality").modal("show");
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalMunicipalityCreate").modal("hide");
                swal({
                    title: "No Logró Añadir el Teléfono.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalMunicipalityCreate").modal("show");
                    });
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorMunicipalityCreate").text(error.responseText);
            $("#ErrorMunicipalityCreate").show();
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

function ShowMunicipalityUpdate() {

    $("#FormModalMunicipality").modal("hide");
    $("#FormModalMunicipalityUpdate").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    municipalityObj = municipalityTable.row(rowSelected).data();
    $("#IdMunicipalityUpdate").val(municipalityObj.Id);
    $("#MunicipalityNameUpdate").val(municipalityObj.Name);
    $("#ActiveMunicipalityUpdate").val(municipalityObj.Active ? 1 : 0);
    $("#ErrorMunicipalityUpdate").hide();
}

function UpdateMunicipality() {

    if (!$("#UpdateMunicipalityForm").valid()) {
        return;
    }

    municipalityObj = {
        "Id": $("#IdMunicipalityUpdate").val(),
        "Department": deparmentObj,
        "Name": $("#MunicipalityNameUpdate").val(),
        "Active": $("#ActiveMunicipalityUpdate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/Municipality/Update',
        type: "POST",
        data: JSON.stringify({ municipality: municipalityObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.result) {
                municipalityTable.ajax.reload();
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalMunicipalityUpdate").modal("hide");
                $("#FormModalMunicipality").modal("show");
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalMunicipalityUpdate").modal("hide");
                swal({
                    title: "No se Logró Actualizar el Municipio.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalMunicipalityUpdate").modal("show");
                    });
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorMunicipalityUpdate").text(error.responseText);
            $("#ErrorMunicipalityUpdate").show();
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

function DeleteMunicipality() {
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    municipalityObj = municipalityTable.row(rowSelected).data();

    $("#FormModalMunicipality").modal("hide");

    swal({
    title: "Eliminar Municipio",
    text: "¿Estas Seguro que Deseas Eliminar este Municipio?",
    type: "warning",
    showCancelButton: true,
    confirmButtonClass: "btn-primary",
    confirmButtonText: "Si",
    cancelButtonText: "No",
    closeOnConfirm: true
},
    function (inputValue) {

        if (!inputValue) {
            $("#FormModalMunicipality").modal("show");
            return
        }

        jQuery.ajax({
            url: '/Municipality/Delete',
            type: "POST",
            data: JSON.stringify({ municipality: municipalityObj }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {

                if (response.result) {
                    municipalityTable.ajax.reload();
                    $("#FormModalMunicipality").modal("show");
                }
                else {
                    swal("No Logró Eliminar el Municipio.", response.message, "error");
                }
            },
            error: function (error) {
                console.log(error);
            },
            beforeSend: function () { }
        });

    });

}
