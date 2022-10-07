import dayjs from "dayjs"
const period = '4h'

const eth = period === '1d' 
    ? [{"time":"Oct 01, 2022 11:00","value":12.823515174052},{"time":"Oct 01, 2022 04:00","value":14.217968385380184},{"time":"Sep 30, 2022 04:00","value":13.118274174839762},{"time":"Sep 29, 2022 04:00","value":13.348220824940602}]
    : [{"time":"Oct 01, 2022 12:00","value":12.8141583601033},{"time":"Oct 01, 2022 08:00","value":12.803904873681793},{"time":"Oct 01, 2022 04:00","value":14.051599348072562},{"time":"Oct 01, 2022 00:00","value":14.026790945469372},{"time":"Sep 30, 2022 20:00","value":14.747526691232048},{"time":"Sep 30, 2022 16:00","value":14.757629558112432},{"time":"Sep 30, 2022 12:00","value":13.952139148212478},{"time":"Sep 30, 2022 08:00","value":13.768067953208174},{"time":"Sep 30, 2022 04:00","value":13.796104614255507},{"time":"Sep 30, 2022 00:00","value":13.595491686442601},{"time":"Sep 29, 2022 20:00","value":13.793666745066819},{"time":"Sep 29, 2022 16:00","value":12.888542700066138},{"time":"Sep 29, 2022 12:00","value":12.264244659743332},{"time":"Sep 29, 2022 08:00","value":12.350794914524746},{"time":"Sep 29, 2022 04:00","value":12.947817083393641},{"time":"Sep 29, 2022 00:00","value":13.612531179048931},{"time":"Sep 28, 2022 20:00","value":13.577386139945236}]
const sn = period === '1d' 
    ? [{"time":"Oct 01, 2022 10:00","value":0.013739184669480814},{"time":"Oct 01, 2022 03:00","value":0.06215167005591681},{"time":"Sep 30, 2022 04:00","value":0.06135544287889057},{"time":"Sep 29, 2022 04:00","value":0.03221615511767202},{"time":"Sep 28, 2022 03:00","value":0.03545348931271748}]
    : [{"time":"Oct 01, 2022 10:00","value":0.017815857473140215},{"time":"Oct 01, 2022 08:00","value":0.01238029373492768},{"time":"Oct 01, 2022 02:00","value":0.027391334297021203},{"time":"Oct 01, 2022 00:00","value":0.029263813679008654},{"time":"Sep 30, 2022 20:00","value":0.05066029183111108},{"time":"Sep 30, 2022 16:00","value":0.07887281629017398},{"time":"Sep 30, 2022 12:00","value":0.0699976009277669},{"time":"Sep 30, 2022 08:00","value":0.034281081573860964},{"time":"Sep 30, 2022 04:00","value":0.06531187433787783},{"time":"Sep 30, 2022 00:00","value":0.05615887898778318},{"time":"Sep 29, 2022 20:00","value":0.07009833338767388},{"time":"Sep 29, 2022 16:00","value":0.06827926839355515},{"time":"Sep 29, 2022 12:00","value":0.04369353184383089},{"time":"Sep 29, 2022 08:00","value":0.021668824298510043},{"time":"Sep 29, 2022 04:00","value":0.029742755901661633},{"time":"Sep 29, 2022 00:00","value":0.036369704651070846},{"time":"Sep 28, 2022 20:00","value":0.04356304254098514},{"time":"Sep 28, 2022 16:00","value":0.03343199219116934},{"time":"Sep 28, 2022 12:00","value":0.022397641942504144},{"time":"Sep 28, 2022 08:00","value":0.018939724625471034},{"time":"Sep 28, 2022 03:00","value":0.029542806210709333},{"time":"Sep 28, 2022 00:00","value":0.041364172414725627}]

let _avgTps = []
eth.forEach((v,i) => {
    const dayExists = period === '1d' && _avgTps.map((x)=>x.time).includes(dayjs(v.time).format('MMM DD YYYY'))
    // console.log('dayExists = ',dayExists)
    
    let snValue = period === '1d' 
        ? sn.find((val) => dayjs(val.time).format('MMM DD YYYY') ===  dayjs(v.time).format('MMM DD YYYY'))
        : sn.find((val) => dayjs(sn[i].time).diff(dayjs(v.time),'hour') > -2 && dayjs(sn[i].time).diff(dayjs(v.time),'hour') <=2)
    
    // if (!dayExists)   {
        _avgTps[i] = {time: v.time, eth_value:v.value}
        if (snValue){
            _avgTps[i].sn_value = snValue?.value;
        }
    // } 
    
        if (i <4) {
            console.log(dayjs(sn[i].time).diff(dayjs(v.time),'hour'))
            console.log(_avgTps[i])        
        }
    
})