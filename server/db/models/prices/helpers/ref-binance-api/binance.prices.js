const binancePrices = [
  {
    123456: '0.00030000',
    ETHBTC: '0.05924700',
    LTCBTC: '0.01731100',
    BNBBTC: '0.00098870',
    NEOBTC: '0.00580000',
    QTUMETH: '0.04910000',
    EOSETH: '0.00932100',
    SNTETH: '0.00050922',
    BNTETH: '0.00740100',
    BCCBTC: '0.14240200',
    GASBTC: '0.00288200',
    BNBETH: '0.01665000',
    BTCUSDT: '16349.01000000',
    ETHUSDT: '969.82000000',
    HSRBTC: '0.00133900',
    OAXETH: '0.00175850',
    DNTETH: '0.00037208',
    MCOETH: '0.01622000',
    ICNETH: '0.00442330',
    MCOBTC: '0.00094600',
    WTCBTC: '0.00070200',
    WTCETH: '0.01188900',
    LRCBTC: '0.00006645',
    LRCETH: '0.00112101',
    QTUMBTC: '0.00292100',
    YOYOBTC: '0.00003220',
    OMGBTC: '0.00113100',
    OMGETH: '0.01909100',
    ZRXBTC: '0.00006931',
    ZRXETH: '0.00116934',
    STRATBTC: '0.00094700',
    STRATETH: '0.01600000',
    SNGLSBTC: '0.00002036',
    SNGLSETH: '0.00034167',
    BQXBTC: '0.00056200',
    BQXETH: '0.00949190',
    KNCBTC: '0.00019284',
    KNCETH: '0.00327230',
    FUNBTC: '0.00001000',
    FUNETH: '0.00016983',
    SNMBTC: '0.00003455',
    SNMETH: '0.00058216',
    NEOETH: '0.09744800',
    IOTABTC: '0.00023238',
    IOTAETH: '0.00394000',
    LINKBTC: '0.00006350',
    LINKETH: '0.00107000',
    XVGBTC: '0.00001015',
    XVGETH: '0.00017110',
    CTRBTC: '0.00019093',
    CTRETH: '0.00322470',
    SALTBTC: '0.00069700',
    SALTETH: '0.01174600',
    MDABTC: '0.00023380',
    MDAETH: '0.00396660',
    MTLBTC: '0.00046600',
    MTLETH: '0.00830000',
    SUBBTC: '0.00010838',
    SUBETH: '0.00185553',
    EOSBTC: '0.00055341',
    SNTBTC: '0.00003033',
    ETCETH: '0.03270900',
    ETCBTC: '0.00195900',
    MTHBTC: '0.00002910',
    MTHETH: '0.00049071',
    ENGBTC: '0.00034793',
    ENGETH: '0.00576180',
    DNTBTC: '0.00002193',
    ZECBTC: '0.03228500',
    ZECETH: '0.54087000',
    BNTBTC: '0.00043898',
    ASTBTC: '0.00007656',
    ASTETH: '0.00129890',
    DASHBTC: '0.06584200',
    DASHETH: '1.11500000',
    OAXBTC: '0.00010430',
    ICNBTC: '0.00026018',
    BTGBTC: '0.01459500',
    BTGETH: '0.24565200',
    EVXBTC: '0.00025396',
    EVXETH: '0.00425000',
    REQBTC: '0.00006000',
    REQETH: '0.00099996',
    VIBBTC: '0.00003279',
    VIBETH: '0.00055149',
    HSRETH: '0.02250100',
    TRXBTC: '0.00001084',
    TRXETH: '0.00018299',
    POWRBTC: '0.00008720',
    POWRETH: '0.00146275',
    ARKBTC: '0.00041420',
    ARKETH: '0.00702900',
    YOYOETH: '0.00054226',
    XRPBTC: '0.00015913',
    XRPETH: '0.00267889',
    MODBTC: '0.00038210',
    MODETH: '0.00641600',
    ENJBTC: '0.00002548',
    ENJETH: '0.00042354',
    STORJBTC: '0.00012421',
    STORJETH: '0.00210430',
    BNBUSDT: '16.16000000',
    VENBNB: '0.23100000',
    YOYOBNB: '0.03193000',
    POWRBNB: '0.08777000',
    VENBTC: '0.00023310',
    VENETH: '0.00393678',
    KMDBTC: '0.00051540',
    KMDETH: '0.00876300',
    NULSBNB: '0.27057000',
    RCNBTC: '0.00002382',
    RCNETH: '0.00039201',
    RCNBNB: '0.02410000',
    NULSBTC: '0.00027624',
    NULSETH: '0.00461299',
    RDNBTC: '0.00035090',
    RDNETH: '0.00594720',
    RDNBNB: '0.35238000',
    XMRBTC: '0.02180000',
    XMRETH: '0.36863000',
    DLTBNB: '0.05621000',
    WTCBNB: '0.69070000',
    DLTBTC: '0.00005595',
    DLTETH: '0.00093829',
    AMBBTC: '0.00006376',
    AMBETH: '0.00107682',
    AMBBNB: '0.06460000',
    BCCETH: '2.39713000',
    BCCUSDT: '2328.00000000',
    BCCBNB: '143.00000000',
    BATBTC: '0.00003448',
    BATETH: '0.00059226',
    BATBNB: '0.03439000',
    BCPTBTC: '0.00007705',
    BCPTETH: '0.00130015',
    BCPTBNB: '0.07871000',
    ARNBTC: '0.00036714',
    ARNETH: '0.00625897',
    GVTBTC: '0.00132010',
    GVTETH: '0.02234900',
    CDTBTC: '0.00001634',
    CDTETH: '0.00027612',
    GXSBTC: '0.00054010',
    GXSETH: '0.00918000',
    NEOUSDT: '94.10500000',
    NEOBNB: '5.82800000',
    POEBTC: '0.00001229',
    POEETH: '0.00020717',
    QSPBTC: '0.00003033',
    QSPETH: '0.00051003',
    QSPBNB: '0.03059000',
    BTSBTC: '0.00004610',
    BTSETH: '0.00078140',
    BTSBNB: '0.04678000',
    XZCBTC: '0.00631500',
    XZCETH: '0.10624900',
    XZCBNB: '6.37700000',
    LSKBTC: '0.00161060',
    LSKETH: '0.02714300',
    LSKBNB: '1.63650000',
    TNTBTC: '0.00001799',
    TNTETH: '0.00030000',
    FUELBTC: '0.00001965',
    FUELETH: '0.00033570',
    MANABTC: '0.00001068',
    MANAETH: '0.00018048',
    BCDBTC: '0.00222700',
    BCDETH: '0.03758000',
    DGDBTC: '0.01059100',
    DGDETH: '0.17764000',
    IOTABNB: '0.23371000',
    ADXBTC: '0.00015364',
    ADXETH: '0.00258880',
    ADXBNB: '0.16191000',
    ADABTC: '0.00006272',
    ADAETH: '0.00106000',
    PPTBTC: '0.00239760',
    PPTETH: '0.04000400',
    CMTBTC: '0.00002664',
    CMTETH: '0.00044954',
    CMTBNB: '0.02718000',
    XLMBTC: '0.00004410',
    XLMETH: '0.00074899',
    XLMBNB: '0.04357000',
    CNDBTC: '0.00000939',
    CNDETH: '0.00015799',
    CNDBNB: '0.00966000',
    LENDBTC: '0.00001500',
    LENDETH: '0.00025500',
    WABIBTC: '0.00018300',
    WABIETH: '0.00308994',
    WABIBNB: '0.17038000',
    LTCETH: '0.29200000',
    LTCUSDT: '284.00000000',
    LTCBNB: '17.98000000',
    TNBBTC: '0.00001269',
    TNBETH: '0.00021417',
    WAVESBTC: '0.00069710',
    WAVESETH: '0.01178300',
    WAVESBNB: '0.65540000',
    GTOBTC: '0.00004008',
    GTOETH: '0.00067540',
    GTOBNB: '0.03924000',
    ICXBTC: '0.00043690',
    ICXETH: '0.00732600',
    ICXBNB: '0.44061000',
    OSTBTC: '0.00004119',
    OSTETH: '0.00070113',
    OSTBNB: '0.04139000',
    ELFBTC: '0.00011283',
    ELFETH: '0.00190693',
    AIONBTC: '0.00049000',
    AIONETH: '0.00820000',
    AIONBNB: '0.48568000',
    NEBLBTC: '0.00059800',
    NEBLETH: '0.01003000',
    NEBLBNB: '0.58000000',
    BRDBTC: '0.00017593',
    BRDETH: '0.00294430',
    BRDBNB: '0.17055000',
    MCOBNB: '0.96071000',
    EDOBTC: '0.00031730',
    EDOETH: '0.00536100',
    WINGSBTC: '0.00007972',
    WINGSETH: '0.00134470',
    NAVBTC: '0.00020300',
    NAVETH: '0.00343000',
    NAVBNB: '0.19900000',
    LUNBTC: '0.00204010',
    LUNETH: '0.03577300',
    TRIGBTC: '0.00041000',
    TRIGETH: '0.00695300',
    TRIGBNB: '0.41599000',
    APPCBTC: '0.00010399',
    APPCETH: '0.00172990',
    APPCBNB: '0.10000000',
  },
];
