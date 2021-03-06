function isLoreal (merchantNum){
    const lorealList = [
        '1000001',
        '1000505',
        '1000834',
        '1000836',
        '1000983',
        '1001383',
        '1001385',
        '1002413',
        '1002775',
        '1002807',
        '1002808',
        '1002811',
        '1002819',
        '10000599',
        '1002858',
        '1002865',
        '1002883',
        '1002884',
        '1002973',
        '1003350',
        '1003530',
        '1004144',
        '1004652',
        '1004984',
        '1005136',
        '1005371',
        '1005453',
        '1005966',
        '1007759'
    ];
    return lorealList.includes(merchantNum);
}

export default isLoreal;