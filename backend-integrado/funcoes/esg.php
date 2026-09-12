<?php

function calcularResultadoGeral(
    string $statusCnpj,
    string $statusCar,
    string $statusAmbiental,
    string $statusTrabalhista
): string {
    $irregularidades = 0;
    $alertas = 0;

    if ($statusCnpj === 'IRREGULAR') $irregularidades++;
    elseif ($statusCnpj === 'PENDENTE') $alertas++;

    if ($statusCar === 'IRREGULAR') $irregularidades++;
    elseif ($statusCar === 'PENDENTE') $alertas++;

    if ($statusAmbiental === 'COM_RESTRICAO') $irregularidades++;
    elseif ($statusAmbiental === 'PENDENTE') $alertas++;

    if ($statusTrabalhista === 'COM_ALERTA') $alertas++;
    elseif ($statusTrabalhista === 'PENDENTE') $alertas++;

    if ($irregularidades >= 2) return 'IRREGULAR';
    if ($irregularidades === 1 || $alertas >= 1) return 'ATENCAO';
    return 'REGULAR';
}
