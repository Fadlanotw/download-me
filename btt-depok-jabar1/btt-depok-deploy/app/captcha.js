import { buatCaptcha } from '@/lib/captcha';
export default function Captcha() {
  const c = buatCaptcha();
  return (<>
    <label>Soal keamanan: berapa hasil {c.soal}?<input name="cjawab" inputMode="numeric" autoComplete="off" required /></label>
    <input type="hidden" name="ctoken" value={c.token} />
    <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true"><label>Jangan diisi<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
  </>);
}
