const http=new slhttp();
const items=document.querySelector('#items');
var flag=0;
var i=0;

http.get('https://st0io9y728.execute-api.ap-south-1.amazonaws.com/v1/rfid')
.then(data=>{
        const dataFromServer = data.Items;
        dataFromServer.sort((a,b)=>{
          return new Date(a.ts.S) - new Date(b.ts.S);
        })
        console.log(dataFromServer);
        // loop to process data
        for(let i=0;i<dataFromServer.length;i++){
                if(dataFromServer[i].IO.N==1 && dataFromServer[i].traversed!=true){
                    var rfid=dataFromServer[i].RFID.S;
                    var rec=dataFromServer[i].REC.N;
                    // console.log(rfid);
                    // sort it ad then do j=i;
                    for(let j=i;j<dataFromServer.length;j++){
                        flag=0;
                      
                        if(dataFromServer[j].REC.N == rec && dataFromServer[j].RFID.S == rfid && dataFromServer[j].IO.N==0 && dataFromServer[j].traversed!=true){
                            const time1= new Date(dataFromServer[i].ts.S)
                            const time2= new Date(dataFromServer[j].ts.S)
                            const diff = (time2-time1)/1000;
                            if(diff< 61 && diff > 0){
                              const result= `RFID Passed through receiver in 60 seconds`;
                              loadAllData(dataFromServer[i],result,dataFromServer[j].ts.S);
                              dataFromServer[i].traversed=true;
                              dataFromServer[j].traversed=true;
                              flag=1;
                              break;
                            }
                            else{
                              const result=`RFID took longer than 60 seconds to pass through`;
                              loadAllData(dataFromServer[i],result,dataFromServer[j].ts.S);
                              flag=1;
                              break;
                            }
                        }
                        else if(dataFromServer[j].RFID.S == rfid && dataFromServer[j].IO.N==1 ){
                                continue;
                            }
                    } //end of 2 loop
                    if(flag==0){
                        const result=`RFID still in range of receiver`;
                        loadAllData(dataFromServer[i],result);
                    }
                }
        } //end of 1 loop

})
.catch((err)=>console.log(err));


function loadAllData(data,result,exitTime){
    // for(let i=0;i<data.length;i++){
    const trow=document.createElement('tr');
    const tdata1=document.createElement('td');
    tdata1.className="text-center";
    const tdata2=document.createElement('td');
    tdata2.className="text-center";
    const tdata3=document.createElement('td');
    tdata3.className="text-center";
    const tdata4=document.createElement('td');
    tdata4.className="text-center";
    const tdata5=document.createElement('td');
    tdata5.className="text-center";
    const tdata6=document.createElement('td');
    tdata6.className="text-center";
    i = i + 1;
    tdata1.innerHTML=`${i}`;
    tdata2.innerHTML= new Date(`${data.ts.S}`).toLocaleString();
    tdata3.innerHTML=`${data.RFID.S}`;
    tdata4.innerHTML=`${data.REC.N}`;
    tdata5.innerHTML=`${result}`;
    tdata6.innerHTML=new Date(`${exitTime}`).toLocaleString();
    trow.appendChild(tdata1);
    trow.appendChild(tdata3);
    trow.appendChild(tdata5);
    trow.appendChild(tdata4);
    trow.appendChild(tdata2);
    trow.appendChild(tdata6);
    items.appendChild(trow);
}