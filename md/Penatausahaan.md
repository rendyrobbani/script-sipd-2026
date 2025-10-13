# SIPD | Penatausahaan

- URL :

```
https://sipd.kemendagri.go.id/penatausahaan
```

## Pengeluaran

### Anggaran Kas Belanja

#### Update

- command : `await penatausahaanPengeluaranBelanja.update(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranBelanja.update(0, 0, 0);
  ```

### Anggaran Kas Pengeluaran Pembiayaan

#### Update

- command : `await penatausahaanPengeluaranPembiayaan.update(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranPembiayaan.update(0, 0, 0);
  ```

### Surat Penyediaan Dana (SPD)

#### Update

- command : `await penatausahaanPengeluaranSPD.update(index, delay);`
- parameters :
	- `index` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSPD.update(0, 0);
  ```

#### Update Rincian

- command : `await penatausahaanPengeluaranSPD.updateRincian(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSPD.updateRincian(0, 0, 0);
  ```

#### Update Rincian by List `ID`

- command : `await penatausahaanPengeluaranSPD.updateRincianByListID(listID, delay);`
- parameters :
	- `listID` : `[{idSKPD: number, idSPD: number}]`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSPD.updateRincianByListID([], 0);
  ```

### Surat Permintaan Pembayaran (SPP)

#### Update

- command : `await penatausahaanPengeluaranSPP.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSPP.update(1, 0, 0);
  ```

#### update by list `Nomor SPP`

- command : `await penatausahaanPengeluaranSPP.updateByListNomor(listNomor, delay);`
- parameters :
	- `listNomor` : `[string]`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSPP.updateByListNomor([], 0);
  ```

#### Update Rincian

- command : `await penatausahaanPengeluaranSPP.updateRincian(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSPP.updateRincian(0, 0, 0);
  ```

### Surat Permintaan Pembayaran (SPM)

#### Update

- command : `await penatausahaanPengeluaranSPM.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSPM.update(1, 0, 0);
  ```

#### Update Rincian

- command : `await penatausahaanPengeluaranSPM.updateRincian(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSPM.updateRincian(0, 0, 0);
  ```

### Surat Perintah Pencairan Dana (SP2D)

#### Update

- command : `await penatausahaanPengeluaranSP2D.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSP2D.update(1, 0, 0);
  ```

#### Update by `Nomor SP2D`

- command : `await penatausahaanPengeluaranSP2D.updateByNomor(nomorSP2D);`
- parameters :
	- `nomorSP2D` : `string`


- example :

  ```
  await penatausahaanPengeluaranSP2D.updateByNomor("");
  ```

#### Update by List `Nomor SP2D`

- command : `await penatausahaanPengeluaranSP2D.updateByListNomor(listNomorSP2D);`
- parameters :
	- `nomorSP2D` : `[string]`


- example :

  ```
  await penatausahaanPengeluaranSP2D.updateByListNomor([]);
  ```

#### Update Rincian

- command : `await penatausahaanPengeluaranSP2D.updateRincian(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSP2D.updateRincian(0, 0, 0);
  ```

#### Update Rincian by List `ID`

- command : `await penatausahaanPengeluaranSP2D.updateRincianByListID(listID, index, delay);`
- parameters :
	- `listID` : `[number]`
	- `index` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSP2D.updateRincianByListID([], 0, 0);
  ```

### Tanda Bukti Pembayaran (TBP)

#### Update

- command : `await penatausahaanPengeluaranTBP.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranTBP.update(1, 0, 0);
  ```

#### Update by `Nomor TBP`

- command : `await penatausahaanPengeluaranTBP.updateByNomor(nomorTBP);`
- parameters :
	- `nomorTBP` : `string`


- example :

  ```
  await penatausahaanPengeluaranTBP.updateByNomor("");
  ```

#### Update by List `Nomor TBP`

- command : `await penatausahaanPengeluaranTBP.updateByListNomor(listNomorTBP);`
- parameters :
	- `nomorTBP` : `[string]`


- example :

  ```
  await penatausahaanPengeluaranTBP.updateByListNomor([]);
  ```

#### Update Rincian

- command : `await penatausahaanPengeluaranTBP.updateRincian(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranTBP.updateRincian(0, 0, 0);
  ```

### Surat Tanda Setoran (STS)

#### Update

- command : `await penatausahaanPengeluaranSTS.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSTS.update(1, 0, 0);
  ```

#### Update by `Nomor STS`

- command : `await penatausahaanPengeluaranSTS.updateByNomor(nomorSTS);`
- parameters :
	- `nomorSTS` : `string`


- example :

  ```
  await penatausahaanPengeluaranSTS.updateByNomor("");
  ```

#### Update by List `Nomor STS`

- command : `await penatausahaanPengeluaranSTS.updateByListNomor(listNomorSTS);`
- parameters :
	- `nomorSTS` : `[string]`


- example :

  ```
  await penatausahaanPengeluaranSTS.updateByListNomor([]);
  ```

#### Update Rincian

- command : `await penatausahaanPengeluaranSTS.updateRincian(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSTS.updateRincian(0, 0, 0);
  ```

#### Update Rincian by List `ID`

- command : `await penatausahaanPengeluaranSTS.updateRincianByListID(listID, index, delay);`
- parameters :
	- `listID` : `[number]`
	- `index` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranSTS.updateRincianByListID([], 0, 0);
  ```

### Realisasi

#### Update

- command : `await penatausahaanPengeluaranRealisasi.update(bulanFrom, bulanInto, delay);`
- parameters :
	- `bulanFrom` : `number`
	- `bulanInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPengeluaranRealisasi.update(1, 12, 0);
  ```

## Penerimaan

### Anggaran Kas Pendapatan

#### Update

- command : `await penatausahaanPenerimaanPendapatan.update(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPenerimaanPendapatan.update(0, 0, 0);
  ```

### Anggaran Kas Penerimaan Pembiayaan

#### Update

- command : `await penatausahaanPenerimaanPembiayaan.update(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPenerimaanPembiayaan.update(0, 0, 0);
  ```

### Surat Tanda Bukti Penerimaan (STBP) | Pendapatan

#### Update

- command : `await penatausahaanPenerimaanSTBPPendapatan.update(indexSKPD, pageFrom, delay);`
- parameters :
	- `indexSKPD` : `number`
	- `pageFrom` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPenerimaanSTBPPendapatan.update(0, 1, 0);
  ```

#### Update Rincian

- command : `await penatausahaanPenerimaanSTBPPendapatan.updateRincian(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPenerimaanSTBPPendapatan.updateRincian(0, 0, 0);
  ```

### Surat Tanda Bukti Penerimaan (STBP) | Pembiayaan

#### Update

- command : `await penatausahaanPenerimaanSTBPPembiayaan.update(indexSKPD, pageFrom, delay);`
- parameters :
	- `indexSKPD` : `number`
	- `pageFrom` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPenerimaanSTBPPembiayaan.update(0, 1, 0);
  ```

#### Update Rincian

- command : `await penatausahaanPenerimaanSTBPPembiayaan.updateRincian(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPenerimaanSTBPPembiayaan.updateRincian(0, 0, 0);
  ```

### Surat Tanda Setoran (STS)

#### Update

- command : `await penatausahaanPenerimaanSTS.update(pageFrom, pageInto, delay);`
- parameters :
	- `pageFrom` : `number`
	- `pageInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPenerimaanSTS.update(1, 0, 0);
  ```

#### Update Rincian

- command : `await penatausahaanPenerimaanSTS.updateRincian(indexFrom, indexInto, delay);`
- parameters :
	- `indexFrom` : `number`
	- `indexInto` : `number`
	- `delay` : `number` in miliseconds


- example :

  ```
  await penatausahaanPenerimaanSTS.updateRincian(0, 0, 0);
  ```

