# SIPD | Pelaporan

- URL :

```
https://peta.sipd.kemendagri.go.id/aklapv2
```

## Rekening

### Update

- command : `await pelaporanRekening.update(level, pageFrom, pageInto, delay);`
- parameters :
	- `level` : `number`
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanRekening.update(1, 1, 0, 0);
  ```

## Jurnal Umum

### Update

- command : `await pelaporanJurnalUmum.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalUmum.update(1, 0, 0);
  ```

## Jurnal Transaksi Non Anggaran

### Update

- command : `await pelaporanJurnalTNA.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalTNA.update(1, 0, 0);
  ```

### Update by `Nomor Jurnal`

- command : `await pelaporanJurnalTNA.updateByNomor(nomorJurnal);`
- parameters :
	- `nomorJurnal` : `string`


- example :

  ```
  await pelaporanJurnalTNA.updateByNomor("#");
  ```

### Update by List `Nomor Jurnal`

- command : `await pelaporanJurnalTNA.updateByListNomor(listNomor, delay);`
- parameters :
	- `listNomor` : array of `string`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalTNA.updateByListNomor([], 0);
  ```

## Jurnal Pendapatan

### Update

- command : `await pelaporanJurnalPendapatan.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalPendapatan.update(1, 0, 0);
  ```

## Jurnal Belanja

### Update

- command : `await pelaporanJurnalBelanja.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalBelanja.update(1, 0, 0);
  ```

### Update by `Nomor Jurnal`

- command : `await pelaporanJurnalBelanja.updateByNomor(nomorJurnal);`
- parameters :
	- `nomorJurnal` : `string`


- example :

  ```
  await pelaporanJurnalBelanja.updateByNomor("#");
  ```

### Update by List `Nomor Jurnal`

- command : `await pelaporanJurnalBelanja.updateByListNomor(listNomor, delay);`
- parameters :
	- `listNomor` : array of `string`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalBelanja.updateByListNomor([], 0);
  ```

## Jurnal Penerimaan Pembiayaan

### Update

- command : `await pelaporanJurnalPembiayaanPenerimaan.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalPembiayaanPenerimaan.update(1, 0, 0);
  ```

### Update by `Nomor Jurnal`

- command : `await pelaporanJurnalPembiayaanPenerimaan.updateByNomor(nomorJurnal);`
- parameters :
	- `nomorJurnal` : `string`


- example :

  ```
  await pelaporanJurnalPembiayaanPenerimaan.updateByNomor("#");
  ```

### Update by List `Nomor Jurnal`

- command : `await pelaporanJurnalPembiayaanPenerimaan.updateByListNomor(listNomor, delay);`
- parameters :
	- `listNomor` : array of `string`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalPembiayaanPenerimaan.updateByListNomor([], 0);
  ```

## Jurnal Pengeluaran Pembiayaan

### Update

- command : `await pelaporanJurnalPembiayaanPengeluaran.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalPembiayaanPengeluaran.update(1, 0, 0);
  ```

### Update by `Nomor Jurnal`

- command : `await pelaporanJurnalPembiayaanPengeluaran.updateByNomor(nomorJurnal);`
- parameters :
	- `nomorJurnal` : `string`


- example :

  ```
  await pelaporanJurnalPembiayaanPengeluaran.updateByNomor("#");
  ```

### Update by List `Nomor Jurnal`

- command : `await pelaporanJurnalPembiayaanPengeluaran.updateByListNomor(listNomor, delay);`
- parameters :
	- `listNomor` : array of `string`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalPembiayaanPengeluaran.updateByListNomor([], 0);
  ```

## Jurnal Reklasifikasi

### Update

- command : `await pelaporanJurnalReklasifikasi.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalReklasifikasi.update(1, 0, 0);
  ```

### Update by `Nomor Jurnal`

- command : `await pelaporanJurnalReklasifikasi.updateByNomor(nomorJurnal);`
- parameters :
	- `nomorJurnal` : `string`


- example :

  ```
  await pelaporanJurnalReklasifikasi.updateByNomor("#");
  ```

### Update by List `Nomor Jurnal`

- command : `await pelaporanJurnalReklasifikasi.updateByListNomor(listNomor, delay);`
- parameters :
	- `listNomor` : array of `string`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalReklasifikasi.updateByListNomor([], 0);
  ```

## Jurnal Koreksi

### Update

- command : `await pelaporanJurnalKoreksi.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalKoreksi.update(1, 0, 0);
  ```

### Update by `Nomor Jurnal`

- command : `await pelaporanJurnalKoreksi.updateByNomor(nomorJurnal);`
- parameters :
	- `nomorJurnal` : `string`


- example :

  ```
  await pelaporanJurnalKoreksi.updateByNomor("#");
  ```

### Update by List `Nomor Jurnal`

- command : `await pelaporanJurnalKoreksi.updateByListNomor(listNomor, delay);`
- parameters :
	- `listNomor` : array of `string`
	- `delay` : `number` in miliseconds


- example :

  ```
  await pelaporanJurnalKoreksi.updateByListNomor([], 0);
  ```

