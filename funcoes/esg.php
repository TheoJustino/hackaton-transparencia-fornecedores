<?php

function limparDocumento(string $valor): string{
    return preg_replace('/\D/', '', $valor);
}

/*
  Calcula o resultado geral de compliance com base nos 4 status:
  status_cnpj: REGULAR, IRREGULAR, PENDENTE
  status_car: REGULAR, IRREGULAR, PENDENTE, NAO_SE_APLICA
  status_ambiental: SEM_RESTRICAO, COM_RESTRICAO, PENDENTE
  status_trabalhista: REGULAR, COM_ALERTA, PENDENTE

  Regra oficial do MVP:
  >= 2 irregularidades graves -> IRREGULAR
  >= 1 pendência/alerta ou 1 irregularidade -> ATENCAO
  caso contrário -> REGULAR
 */

function calcularResultadoGeral(
    string $statusCnpj,
    string $statusCar,
    string $statusAmbiental,
    string $statusTrabalhista
): string{
    $irregularidade = 0;
    $alertaOuPendencias = 0;

    if($statusCnpj === 'IRREGULAR'){
        $irregularidade++;
    } elseif($statusCnpj === 'PENDENTE'){
        $alertaOuPendencias++;
    }

    if($statusCar === 'IRREGULAR'){
        $irregularidade++;
    } elseif($statusCar === 'PENDENTE'){
        $alertaOuPendencias++;
    }

    if($statusAmbiental === 'COM_RESTRICAO'){
        $irregularidade++;
    } elseif($statusAmbiental === 'PENDENTE'){
        $alertaOuPendencias++;
    }

    if($statusTrabalhista === 'COM_ALERTA'){
        $alertaOuPendencias++;
    } elseif($statusTrabalhista === 'PENDENTE'){
        $alertaOuPendencias++;
    }

    if($irregularidade >= 2){
        return 'IRREGULAR';
    }

    if($irregularidade === 1 || $alertaOuPendencias >= 1){
        return 'ATENCAO';
    }

    return 'REGULAR';
}