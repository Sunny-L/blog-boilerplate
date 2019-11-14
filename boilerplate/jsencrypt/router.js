const router = require('express').Router()
const JSEncrypt = require('node-jsencrypt')


router.get('/jsencrypt', (req, res, next) => {
    // Online RSA Key Generator http://travistidwell.com/jsencrypt/demo/
    const publicKey = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmRyIPAt+HhI/oo2sY5bpw9HJ5
    WVJhaCMSBnriQncl40fZ8Tgxl/PeKHEiPPA3YFu175I35/BOxXTymrfeCdS2+W8O
    oAyYj75sdXwS3KJo3nUiXrVPXTeyBsok6F84cJY2dCGHKyr3ek29LXrWiXPI5JOM
    a/j6Ks3lms6W6sEnHwIDAQAB
    -----END PUBLIC KEY-----`
    res.render('jsencrypt', {
        publicKey,
        layout: false
    })
})
router.post('/jsencrypt', (req, res, next) => {
    const privateKey = `-----BEGIN RSA PRIVATE KEY-----
    MIICXAIBAAKBgQCmRyIPAt+HhI/oo2sY5bpw9HJ5WVJhaCMSBnriQncl40fZ8Tgx
    l/PeKHEiPPA3YFu175I35/BOxXTymrfeCdS2+W8OoAyYj75sdXwS3KJo3nUiXrVP
    XTeyBsok6F84cJY2dCGHKyr3ek29LXrWiXPI5JOMa/j6Ks3lms6W6sEnHwIDAQAB
    AoGALj1f0k7ZPIV3w5kWYlEYXOsNnoNhbmcYQZ39tEgJfEbNJ2V2XAxGrAQRGhVa
    M/we5ORfhB6C7FTq5cBy21NejKTX5ng2ak3jxc/9Kbz82L7qngzdx2ZiN1H9B3ON
    b3zD9b37ooCXbLLnSs2DZ3KYqH1F2Zgbe23wxz6vEPX2AwkCQQDU/C07KKX1JnuT
    +ymvX/9gMoqPd1PCenA80EZCCsG2HxILDy9vbGHLlMf4diYWKYecLJowAZu1Urbl
    LujEqbtlAkEAx9wV21G6nBTVc32ZhCTKnXBF7MVDJEZ7lohITOWF2pHaD/fxN8Nm
    C7YcSZ8wVLkcIWPNONGapJAGas6WROVqMwJBAMcuAnrFu9Y0o/MzOruY0jG7cltS
    49EHQfmNaXcPqjLQgcY38EuKlzaVMCHLFDk7o2fJSnTEvEJpVUOlh+eLOAUCQCg9
    NJ1awDKqsys0j5MegTjfoQSB1vnXwwxU1hG9aIzQLtJmPkfW7JXRDbL4/Rchyfsj
    B++3q+YUJWadv32RnycCQGq1nHlC7jceyR2OFeDMRNDb6Vh+h7f4N0f/KiKv0cim
    4YdQEltkxelUA6k/VhH7jWX/YxdoObnKzPhjkc986i8=
    -----END RSA PRIVATE KEY-----`
    const decrypt = new JSEncrypt()
    decrypt.setPrivateKey(privateKey)
    let val = decrypt.decrypt(req.body.val)
    res.json({
        val
    })
})

module.exports = router