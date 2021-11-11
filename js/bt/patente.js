/*********************************/
/****** VARIABLES GLOBALES ******/
/*******************************/
var nbrJoursEstimee = 0, nbrJoursReelle = 0, rc = 0, rc_due = 0, rf = 0, rf_due = 0, totalHT = 0, totalHT_due = 0,
    tppa_due = 0, totalTVA = 0, totalTVA_due = 0, tf = 0, tf_due = 0, totalTaxes = 0, totalTaxes_due = 0, rcFactureEstimee = 0, tppaFactureEstimee = 0,
    acompte = 0, nbrJoursPeriode = 0, consomJournaliere = 0, rcPeriode = 0, rcPeriode_due = 0, rc_estimee = 0, rc_reelle = 0;

/*********************************/
/*********** FONCTIONS ***********/
/********************************/

function CalculerRCEstimee() {
    $('#consommation,#difference,#tc,.tc-radio input,#selectCompteur,#dateDebEstimee,#dateFinEstimee').on('keyup change', function () {
        var consommation = $('#consommation').val();
        var consom1 = 0, consom2 = 0;
        var puEstime = 0;
        var seuilSelectivite = consommation * nbrJoursEstimee / 30;
        $('#seuilSelectivite').text(seuilSelectivite);
        if (nbrJoursEstimee >= 28 && nbrJoursEstimee <= 31) { // Tranches Normales
            if (consommation <= 150) {
                puEstime = '1.32860';
                consom1 = Number(Math.round(consommation * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").html("<p>Tranche 1</p><br>");
                $("#trancheEstimeAr").html("<p>1 الشطر</p><br>");
                $('#qteEstime').html("<p>" + consommation + "</p><br>");
                $('#puEstime').html("<p>" + puEstime + "</p><br>");
                $('#montantEstime').html("<p>" + consom1 + "</p><br>");

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + 'e2') + 'e-2');
                rc_due = consom1;
            }
            else {
                puEstime = '1.32860';
                consom1 = Number(Math.round(150 * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").html("<p>Tranche 1</p><br>");
                $("#trancheEstimeAr").html("<p>1 الشطر</p><br>");
                $('#qteEstime').html("<p>" + 150 + "</p><br>");
                $('#puEstime').html("<p>" + puEstime + "</p><br>");
                $('#montantEstime').html("<p>" + consom1 + "</p><br>");
                puEstime = '1.49913';
                consom2 = Number(Math.round((consommation - 150) * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").append("<p>Tranche 2</p>");
                $("#trancheEstimeAr").append("<p>2 الشطر</p>");
                $('#qteEstime').append("<p>" + (consommation - 150) + "</p>");
                $('#puEstime').append("<p>" + puEstime + "</p>");
                $('#montantEstime').append("<p>" + consom2 + "</p>");

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + consom2 + 'e2') + 'e-2');
                rc_due = consom1 + consom2;
            }
        }
        else { // Tranches Ajustées
            var tr1 = Math.ceil((150 * nbrJoursEstimee / 30));
            if (consommation <= tr1) {
                puEstime = '1.32860';
                consom1 = Number(Math.round(consommation * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").html("<p>Tranche 1</p><br>");
                $("#trancheEstimeAr").html("<p>1 الشطر</p><br>");
                $('#qteEstime').html("<p>" + consommation + "</p><br>");
                $('#puEstime').html("<p>" + puEstime + "</p><br>");
                $('#montantEstime').html("<p>" + consom1 + "</p><br>");

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + 'e2') + 'e-2');
                rc_due = consom1;
            }
            else {
                // Variables pour ajustement des bornes sup et inf
                puEstime = '1.32860';
                consom1 = Number(Math.round(tr1 * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").html("<p>Tranche 1</p><br>");
                $("#trancheEstimeAr").html("<p>1 الشطر</p><br>");
                $('#qteEstime').html("<p>" + tr1 + "</p><br>");
                $('#puEstime').html("<p>" + puEstime + "</p><br>");
                $('#montantEstime').html("<p>" + consom1 + "</p><br>");
                puEstime = '1.49913';
                consom2 = Number(Math.round((consommation - tr1) * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").append("<p>Tranche 2</p>");
                $("#trancheEstimeAr").append("<p>2 الشطر</p>");
                $('#qteEstime').append("<p>" + (consommation - tr1) + "</p>");
                $('#puEstime').append("<p>" + puEstime + "</p>");
                $('#montantEstime').append("<p>" + consom2 + "</p>");

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + consom2 + 'e2') + 'e-2');
                rc_due = consom1 + consom2;
            }
        }
        //#########################################
        // Calcules

        CalculerTotalHT();
        CalculerTotalTVA();
        CalculerTF();
        CalculerTotalTaxes();
        CalculerTotalFacture();
        console.log("Partie Estimée =====>>    rc_due = " + rc_due + "  rf_due = " + rf_due + "  totalHT = " + totalHT);
        $('#totalHT').text(totalHT);
    });
}

function CalculerRCAcompte() {
    $('#consomEstimee,#selectCompteur,#dateDebEstimee,#dateFinEstimee,#acompte').on('keyup change', function () {
        var consommation = $('#consomEstimee').val();
        var consom1 = 0, consom2 = 0;
        var puEstime = 0;
        var seuilSelectivite = consommation * nbrJoursEstimee / 30;
        $('#seuilSelectivite').text(seuilSelectivite);
        if (nbrJoursEstimee >= 28 && nbrJoursEstimee <= 31) { // Tranches Normales
            if (consommation <= 150) {
                puEstime = '1.32860';
                consom1 = Number(Math.round(consommation * parseFloat(puEstime) + 'e2') + 'e-2');

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + 'e2') + 'e-2');
                rc_due = consom1;
            }
            else {
                puEstime = '1.32860';
                consom1 = Number(Math.round(150 * parseFloat(puEstime) + 'e2') + 'e-2');
                puEstime = '1.49913';
                consom2 = Number(Math.round((consommation - 150) * parseFloat(puEstime) + 'e2') + 'e-2');

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + consom2 + 'e2') + 'e-2');
                rc_due = consom1 + consom2;
            }
        }
        else { // Tranches Ajustées
            var tr1 = Math.ceil((150 * nbrJoursEstimee / 30));
            if (consommation <= tr1) {
                puEstime = '1.32860';
                consom1 = Number(Math.round(consommation * parseFloat(puEstime) + 'e2') + 'e-2');

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + 'e2') + 'e-2');
                rc_due = consom1;
            }
            else {
                // Variables pour ajustement des bornes sup et inf
                puEstime = '1.32860';
                consom1 = Number(Math.round(tr1 * parseFloat(puEstime) + 'e2') + 'e-2');
                puEstime = '1.49913';
                consom2 = Number(Math.round((consommation - tr1) * parseFloat(puEstime) + 'e2') + 'e-2');

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + consom2 + 'e2') + 'e-2');
                rc_due = consom1 + consom2;
            }
        }

        rcFactureEstimee = rc_due;
        tppaFactureEstimee = tppa_due;

        $('#rcE').text(Number(Math.floor(rcFactureEstimee * 0.14 + 'e2') + 'e-2'));
        $('#tppaE').text(Number(Math.floor(tppaFactureEstimee * 0.2 + 'e2') + 'e-2'));

        //#########################################
        $('#rcestimereelle').text(rc_due);
        // Calcules
        CalculerAcompte();
    });
}

function CalculerRCEstimeeReelle() {
    $('#consommation,#difference,#tc,.tc-radio input,#selectCompteur,#dateDebEstimee,#dateFinEstimee,#dateFinReelle,#ancienIndex,#nouvelIndex').on('keyup change', function () {
        var consommation = Number(Math.floor(consomJournaliere * nbrJoursEstimee));
        var consom1 = 0, consom2 = 0;
        var puEstime = 0;
        var seuilSelectivite = 0;
        if (nbrJoursEstimee >= 28 && nbrJoursEstimee <= 31) { // Tranches Normales
            if (consommation <= 150) {
                puEstime = '1.32860';
                consom1 = Number(Math.round(consommation * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").html("<p>Tranche 1</p><br>");
                $("#trancheEstimeAr").html("<p>1 الشطر</p><br>");
                $('#qteEstime').html("<p>" + consommation + "</p><br>");
                $('#puEstime').html("<p>" + puEstime + "</p><br>");
                $('#montantEstime').html("<p>" + consom1 + "</p><br>");

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + 'e2') + 'e-2');
                rc_due = consom1;
                rc_estimee = consom1;
            }
            else {
                puEstime = '1.32860';
                consom1 = Number(Math.round(150 * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").html("<p>Tranche 1</p><br>");
                $("#trancheEstimeAr").html("<p>1 الشطر</p><br>");
                $('#qteEstime').html("<p>" + 150 + "</p><br>");
                $('#puEstime').html("<p>" + puEstime + "</p><br>");
                $('#montantEstime').html("<p>" + consom1 + "</p><br>");
                puEstime = '1.49913';
                consom2 = Number(Math.round((consommation - 150) * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").append("<p>Tranche 2</p>");
                $("#trancheEstimeAr").append("<p>2 الشطر</p>");
                $('#qteEstime').append("<p>" + (consommation - 150) + "</p>");
                $('#puEstime').append("<p>" + puEstime + "</p>");
                $('#montantEstime').append("<p>" + consom2 + "</p>");

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = consom1 + consom2;
                rc_due = consom1 + consom2;
                rc_estimee = consom1 + consom2;
            }
        }
        else { // Tranches Ajustées
            var tr1 = Math.ceil((150 * nbrJoursEstimee / 30));
            if (consommation <= tr1) {
                puEstime = '1.32860';
                consom1 = Number(Math.round(consommation * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").html("<p>Tranche 1</p><br>");
                $("#trancheEstimeAr").html("<p>1 الشطر</p><br>");
                $('#qteEstime').html("<p>" + consommation + "</p><br>");
                $('#puEstime').html("<p>" + puEstime + "</p><br>");
                $('#montantEstime').html("<p>" + consom1 + "</p><br>");

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + 'e2') + 'e-2');
                rc_due = consom1;
                rc_estimee = consom1;
            }
            else {
                seuilSelectivite = consommation * nbrJoursEstimee / 30;
                $('#seuilSelectivite').text(seuilSelectivite);
                // Variables pour ajustement des bornes sup et inf
                puEstime = '1.32860';
                consom1 = Number(Math.round(tr1 * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").html("<p>Tranche 1</p><br>");
                $("#trancheEstimeAr").html("<p>1 الشطر</p><br>");
                $('#qteEstime').html("<p>" + tr1 + "</p><br>");
                $('#puEstime').html("<p>" + puEstime + "</p><br>");
                $('#montantEstime').html("<p>" + consom1 + "</p><br>");
                puEstime = '1.49913';
                consom2 = Number(Math.round((consommation - tr1) * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheEstimeFr").append("<p>Tranche 2</p>");
                $("#trancheEstimeAr").append("<p>2 الشطر</p>");
                $('#qteEstime').append("<p>" + (consommation - tr1) + "</p>");
                $('#puEstime').append("<p>" + puEstime + "</p>");
                $('#montantEstime').append("<p>" + consom2 + "</p>");
                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = consom1 + consom2;
                rc_due = consom1 + consom2;
                rc_estimee = consom1 + consom2;
            }
        }
        //#########################################

        if (isNaN(consommation)) {
            $('#qteEstime p, #qteReelle p,#montantEstime p,#montantReelle p,#timbreFiscal,#totalTaxes').text("-");
        }
        // Calcules
        if ($('#selectTypeReleve option:selected').text() == 'Réel') {
            CalculerRCPeriode();
        }
        else {
            CalculerRCEstimee();
        }
    });
}


function CalculerRCReelle() {
    $('#dateDebEstimee,#dateFinEstimee,#dateDebReelle,#dateFinReelle,#consommation,#difference,#tc,.tc-radio input,#ancienIndex,#nouvelIndex').on("change keyup", function () {
        var consommation = Number(Math.ceil(consomJournaliere * nbrJoursReelle));
        var consom1 = 0, consom2 = 0;
        var puReelle = 0;
        var seuilSelectivite = 0;
        if (nbrJoursReelle >= 28 && nbrJoursReelle <= 31) { // Tranches Normales
            if (consommation <= 150) {
                puEstime = '1.32860';
                consom1 = Number(Math.round(150 * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheReelleFr").html("<p>Tranche 1</p><br>");
                $("#trancheReelleAr").html("<p>1 الشطر</p><br>");
                $('#qteReelle').html("<p>" + 150 + "</p><br>");
                $('#puReelle').html("<p>" + puEstime + "</p><br>");
                $('#montantReelle').html("<p>" + consom1 + "</p><br>");

                rc = Number(Math.round(consom1 + 'e2') + 'e-2');
                rc_due = consom1;
                rc_reelle = consom1;
            }
            else {
                puEstime = '1.32860';
                consom1 = Number(Math.round(150 * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheReelleFr").html("<p>Tranche 1</p><br>");
                $("#trancheReelleAr").html("<p>1 الشطر</p><br>");
                $('#qteReelle').html("<p>" + 150 + "</p><br>");
                $('#puReelle').html("<p>" + puEstime + "</p><br>");
                $('#montantReelle').html("<p>" + consom1 + "</p><br>");
                puEstime = '1.49913';
                consom2 = Number(Math.round((consommation - 150) * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheReelleFr").append("<p>Tranche 2</p>");
                $("#trancheReelleAr").append("<p>2 الشطر</p>");
                $('#qteReelle').append("<p>" + (consommation - 150) + "</p>");
                $('#puReelle').append("<p>" + puEstime + "</p>");
                $('#montantReelle').append("<p>" + consom2 + "</p>");
                rc = consom1 + consom2;
                rc_due = consom1 + consom2;
                rc_reelle = consom1 + consom2;
            }
        }
        else { // Tranches Ajustées
            var tr1 = Math.ceil((150 * nbrJoursReelle / 30));
            if (consommation <= tr1) {
                puEstime = '1.32860';
                consom1 = Number(Math.round(consommation * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheReelleFr").html("<p>Tranche 1</p><br>");
                $("#trancheReelleAr").html("<p>1 الشطر</p><br>");
                $('#qteReelle').html("<p>" + consommation + "</p><br>");
                $('#puReelle').html("<p>" + puEstime + "</p><br>");
                $('#montantReelle').html("<p>" + consom1 + "</p><br>");
                rc = consom1;
                rc_due = consom1;
                rc_reelle = consom1;
            }
            else {
                // Variables pour ajustement des bornes sup et inf
                puEstime = '1.32860';
                consom1 = Number(Math.round(tr1 * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheReelleFr").html("<p>Tranche 1</p><br>");
                $("#trancheReelleAr").html("<p>1 الشطر</p><br>");
                $('#qteReelle').html("<p>" + tr1 + "</p><br>");
                $('#puReelle').html("<p>" + puEstime + "</p><br>");
                $('#montantReelle').html("<p>" + consom1 + "</p><br>");
                puEstime = '1.49913';
                consom2 = Number(Math.round((consommation - tr1) * parseFloat(puEstime) + 'e2') + 'e-2');
                $("#trancheReelleFr").append("<p>Tranche 2</p>");
                $("#trancheReelleAr").append("<p>2 الشطر</p>");
                $('#qteReelle').append("<p>" + (consommation - tr1) + "</p>");
                $('#puReelle').append("<p>" + puEstime + "</p>");
                $('#montantReelle').append("<p>" + consom2 + "</p>");

                CalculerTPPAN(consommation, nbrJoursEstimee);
                rc = Number(Math.round(consom1 + consom2 + 'e2') + 'e-2');
                rc_due = consom1 + consom2;
                rc_reelle = consom1 + consom2;
            }

        }

        //#########################################
        if (isNaN(consommation)) {
            $('#qteEstime p, #qteReelle p,#montantEstime p,#montantReelle p,#timbreFiscal,#totalTaxes').text("-");
        }
        // Calcules
        CalculerRCPeriode();
    });
}


function CalculerRCPeriode() {
    $('#consommation,#difference,#tc,.tc-radio input,#selectCompteur,#dateDebEstimee,#dateFinEstimee,#dateDebReelle,#dateFinReelle,#consomEstimee,#nouvelIndex,#ancienIndex').on('keyup change click', function () {
        var consommation = $('#consommation').val();
        var consom1 = 0, consom2 = 0, consom1_due = 0, consom2_due = 0;
        var puEstime = 0;
        if (nbrJoursPeriode >= 28 && nbrJoursPeriode <= 31) { // Tranches Normales
            if (consommation <= 150) {
                puEstime = '1.32860';
                consom1 = Number(Math.round(consommation * parseFloat(puEstime) + 'e2') + 'e-2');
                consom1_due = Number(Math.floor(consommation * parseFloat(puEstime) + 'e2') + 'e-2');

                rc = Number(Math.round(consom1 + 'e2') + 'e-2');
                rc_due = Number(Math.floor(consom1 + 'e2') + 'e-2');
            }
            else {
                puEstime = '1.32860';
                consom1 = Number(Math.round(100 * parseFloat(puEstime) + 'e2') + 'e-2');
                consom1_due = Number(Math.floor(100 * parseFloat(puEstime) + 'e2') + 'e-2');
                puEstime = '1.49913';
                consom2 = Number(Math.round((consommation - 100) * parseFloat(puEstime) + 'e2') + 'e-2');
                consom2_due = Number(Math.floor((consommation - 100) * parseFloat(puEstime) + 'e2') + 'e-2');

                rc = consom1 + consom2;
                rc_due = consom1_due + consom2_due;

            }
        }
        else { // Tranches Ajustées
            var tr1 = Math.ceil((150 * nbrJoursEstimee / 30));

            if (consommation <= tr1) {
                puEstime = '1.32860';
                consom1 = Number(Math.round(consommation * parseFloat(puEstime) + 'e2') + 'e-2');
                consom1_due = Number(Math.floor(consommation * parseFloat(puEstime) + 'e2') + 'e-2');

                rc = consom1;
                rc_due = consom1_due;
            }
            else {
                puEstime = '1.32860';
                consom1 = Number(Math.round(tr1 * parseFloat(puEstime) + 'e2') + 'e-2');
                consom1_due = Number(Math.floor(tr1 * parseFloat(puEstime) + 'e2') + 'e-2');
                puEstime = '1.49913';
                consom2 = Number(Math.round((consommation - tr1) * parseFloat(puEstime) + 'e2') + 'e-2');
                consom2_due = Number(Math.floor((consommation - tr1) * parseFloat(puEstime) + 'e2') + 'e-2');

                rc = Number(Math.round(consom1 + consom2 + 'e2') + 'e-2');
                rc_due = Number(Math.floor(consom1_due + consom2_due + 'e2') + 'e-2');
            }

            rc = Number(Math.round(rc_estimee + rc_reelle + 'e2') + 'e-2');
            rc_due = Number(Math.floor(rc_estimee + rc_reelle + 'e2') + 'e-2');

        }
        //#########################################
        // Calcules
        CalculerTPPAN(consommation, nbrJoursPeriode);

        CalculerTotalRCPeriode();
        CalculerTotalHTPeriode();
        CalculerTotalTVAPeriode();
        CalculerTF();
        CalculerTotalTaxes();

        CalculerTotalFacture();

        console.log("Partie Réelle =====>>    rc_due = " + rc_due + "  rf_due = " + rf_due + "  totalHT = " + totalHT);
        $('#totalHT').text(totalHT);
    });
}
