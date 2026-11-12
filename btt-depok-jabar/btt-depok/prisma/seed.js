const {PrismaClient}=require('@prisma/client');const bcrypt=require('bcryptjs');
const p=new PrismaClient();
const akun=[['admin','Super Admin','admin123'],['disrumkim','Petugas Disrumkim','depok123'],['sekda','Sekretaris Daerah','depok123'],['hukum','Petugas Bagian Hukum','depok123'],['walikota','Wali Kota Depok','depok123'],['bkd','Petugas BKD','depok123']];
(async()=>{let i=0;for(const [r,n,pw] of akun){i++;await p.user.upsert({where:{email:r+'@depok.go.id'},update:{role:r},create:{nama:n,nik:'STAF-0000'+i,email:r+'@depok.go.id',password:await bcrypt.hash(pw,10),role:r}});console.log(r+'@depok.go.id / '+pw)}process.exit(0)})();
