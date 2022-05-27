// Variables Globales
var rowSelected;
var purchaseTable;
var purchaseObj;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    $('#CollapseMenuSupplier').addClass('active');
    $('#collapseSix').addClass('show');
    $('#CollapseMenuItemHistoryPurchase').addClass('active');

    // Show DataTable
    Read();
}

function Read() {

    $.fn.dataTable.moment('DD/MM/YYYY HH:mm:ss a');

    purchaseTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Purchase/Read',
            type: "GET",
            dataType: "json"
        },
        columnDefs: [{
            target: 1,
            type: 'datetime-moment'
        }],
        "columns": [
            { "data": "Id" },
            { "data": "StringTimeStamp", "render": s => s.substring(0, 20) + (s.substring(20) == 'a. m.' ? 'am' : 'pm') },
            { "data": "Supplier.Name" },
            { "data": "Total" },
            {
                "data": "Id", render: function (data, type, row, meta) {
                    var json = JSON.stringify(row);
                    return "<button class='btn btn-info btn-circle btn-sm mr-1 mb-1' type='button' onclick='invoice(" + json + ")'><i class='fas fa-file-invoice'></i></button>"
                },
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        },
        "order": [[1, "desc"]]
    });
}

function invoice(json) {
    var url = "/Purchase/Invoce?id=" + json.Id;
    window.open(url);
}
