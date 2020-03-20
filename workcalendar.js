(function ($, undefined) {
$.widget("o.workcalendar",{
options: {
      currYear:null,
      currMonth:null,
      url:null,
      defAction:null,
      modifyAction:'modify',
      extParams:{},
      employees:{},
      enableTools:true,
      _defIcon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADM0lEQVRYhe2VTWgTQRSAJ9WjHkW0ngRrZpuYn00puWiLqId6UhD8w6uCoFJRvL0kpqnYmBRtdmNREP+Dh2qRZtrQ0kgLptoUxDS7m/4QsKi02F4EQX1ebFSym+zGtHjwwbsszPu+efNmlpD/YTQQTW5BquWjueYGUT7QIMoH+Giu2XE9u3lFuY2iwrlEJeSKSrMuUUG15MXcjCuiBPmoZK4a2C1Ita6I8kgLqpqC/J0XlXt8NLPpr+B8VG5xifInQ/A/OqLMOwVlX4Xw3AmXKH+rFF6QEOSvDYJy1BDcKcj7qwH/XYKPKnt1wd2CVMsL0lK5oq19eZxfXML5xSU89zyvR2KhsXt6Y/nWi3JMz67O9U4VBM4+m9LbjTsl4T+vmq5iRx5M4uPUND5OTePh+5O6b0ejOLVNe/eRrKBXwB5OIwWGFBg6whMGrqh0TZ2OaOIFaaFag6c5C12TH9Tb361s0VNg160cPki/x543Hwt5/MmsIQnHbWVDkYA9kmnRs9g/+A6fpOcwKX/4NYS9M4YEGm683V0k4AhPXNSz2NaRQgoMTz98VRA40yMbO4bO9JligWvjASNFzj5VKhawh15DkcCOqy9htQR2BFOXigQs/uSx1RKovzx4sEigDpjZ2aXzQfkLAWdXBusgsbVIoAmG1tqCY19WWsDWMfaZANSovgWcPxFfWQEZOf9wjyqcEEKoJ95iD6dLFmnty2NrXx67R3/9DW+O5gvfS0//OFIP26MpQABqOF8iwwuSZpFlqFZqCkSySH0DaYJo0hYghFBgOy1tSeRF9bYu/4C0UkvA0jb83eztc5eEF2YBWMDaPqIq4QhPlEw1uLV9BDno9+iCE0IIicXWUGAPLYEk8hHt4yibkSxa2pJIgd3VnHytaIKhtRRYhPMm0B4aR5fGkWhNuz00jtSbQDOwThKLrTEE/z04iB8yQ/x9vW8QbcExdN7IlHxkbB1jyPkGkQKbM3vixS9eJbH9ytP1FPovUGA5Cgw5bwIt/mG0Bl6gNfACLf5h5LwDSIGhGeIyB+x8PQytqwr8j0A0mb0DVuphpyiwEAV252eGOIifpMAsZa/ZvxY/AFdVpN9s7LnZAAAAAElFTkSuQmCC',
      holidayWeekDay: [6, 7],
      shiftList: [
          {
             value:'0',
             option:'0-ая (00:00 - 09:00)'
          },
          {
              value:'1',
              option:'1-ая (01:00 - 10:00)'
          },
          {
              value:'2',
              option:'2-ая (02:00 - 11:00)'
          },
          {
              value:'3',
              option:'3-ая (03:00 - 12:00)'
          },
          {
              value:'4',
              option:'4-ая (04:00 - 03:00)'
          },
          {
              value:'5',
              option:'5-ая (05:00 - 14:00)'
          },
          {
              value:'6',
              option:'6-ая (06:00 - 15:00)'
          },
          {
              value:'7',
              option:'7-ая (07:00 - 16:00)'
          },
          {
              value:'8',
              option:'8-ая (08:00 - 17:00)'
          },
          {
              value:'9',
              option:'9-ая (09:00 - 18:00)'
          },
          {
              value:'10',
              option:'10-ая (10:00 - 19:00)'
          },
          {
              value:'11',
              option:'11-ая (11:00 - 20:00)'
          },
          {
              value:'12',
              option:'12-ая (12:00 - 21:00)'
          },
          {
              value:'13',
              option:'13-ая (13:00 - 22:00)'
          },
          {
              value:'14',
              option:'14-ая (14:00 - 23:00)'
          },
          {
              value:'15',
              option:'15-ая (15:00 - 24:00)'
          },
          {
              value:'16',
              option:'16-ая (16:00 - 01:00)'
          },
          {
              value:'17',
              option:'17-ая (17:00 - 02:00)'
          },
          {
              value:'18',
              option:'18-ая (18:00 - 03:00)'
          },
          {
              value:'19',
              option:'19-ая (19:00 - 04:00)'
          },
          {
              value:'20',
              option:'20-ая (20:00 - 05:00)'
          },
          {
              value:'21',
              option:'21-ая (21:00 - 06:00)'
          },
          {
              value:'22',
              option:'22-ая (22:00 - 07:00)'
          },
          {
              value:'23',
              option:'23-ая (23:00 - 08:00)'
          },
          {
              value:'24',
              option:'24-ая (24:00 - 09:00)'
          }
      ],
      typeList:{
        'info':{
              'text':'Информация',
              'icon':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADM0lEQVRYhe2VTWgTQRSAJ9WjHkW0ngRrZpuYn00puWiLqId6UhD8w6uCoFJRvL0kpqnYmBRtdmNREP+Dh2qRZtrQ0kgLptoUxDS7m/4QsKi02F4EQX1ebFSym+zGtHjwwbsszPu+efNmlpD/YTQQTW5BquWjueYGUT7QIMoH+Giu2XE9u3lFuY2iwrlEJeSKSrMuUUG15MXcjCuiBPmoZK4a2C1Ita6I8kgLqpqC/J0XlXt8NLPpr+B8VG5xifInQ/A/OqLMOwVlX4Xw3AmXKH+rFF6QEOSvDYJy1BDcKcj7qwH/XYKPKnt1wd2CVMsL0lK5oq19eZxfXML5xSU89zyvR2KhsXt6Y/nWi3JMz67O9U4VBM4+m9LbjTsl4T+vmq5iRx5M4uPUND5OTePh+5O6b0ejOLVNe/eRrKBXwB5OIwWGFBg6whMGrqh0TZ2OaOIFaaFag6c5C12TH9Tb361s0VNg160cPki/x543Hwt5/MmsIQnHbWVDkYA9kmnRs9g/+A6fpOcwKX/4NYS9M4YEGm683V0k4AhPXNSz2NaRQgoMTz98VRA40yMbO4bO9JligWvjASNFzj5VKhawh15DkcCOqy9htQR2BFOXigQs/uSx1RKovzx4sEigDpjZ2aXzQfkLAWdXBusgsbVIoAmG1tqCY19WWsDWMfaZANSovgWcPxFfWQEZOf9wjyqcEEKoJ95iD6dLFmnty2NrXx67R3/9DW+O5gvfS0//OFIP26MpQABqOF8iwwuSZpFlqFZqCkSySH0DaYJo0hYghFBgOy1tSeRF9bYu/4C0UkvA0jb83eztc5eEF2YBWMDaPqIq4QhPlEw1uLV9BDno9+iCE0IIicXWUGAPLYEk8hHt4yibkSxa2pJIgd3VnHytaIKhtRRYhPMm0B4aR5fGkWhNuz00jtSbQDOwThKLrTEE/z04iB8yQ/x9vW8QbcExdN7IlHxkbB1jyPkGkQKbM3vixS9eJbH9ytP1FPovUGA5Cgw5bwIt/mG0Bl6gNfACLf5h5LwDSIGhGeIyB+x8PQytqwr8j0A0mb0DVuphpyiwEAV252eGOIifpMAsZa/ZvxY/AFdVpN9s7LnZAAAAAElFTkSuQmCC'
          },
        'birthday':{
          'text':'День рожденья',
            icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAKJElEQVRYhd2Wd1CVZxbGn+/7uCjLQsBeUDIsatYMMeJEg4KAiIUQGxD0Wlc2EjYZ20WNJCpq3Bhj7CVYgyWxYUzEhtJ7rxe8FFFEOlwu91I+FZ/9w2smm8nOuLPu/rFn5sz71zvnd57nvGde4P8hWLHutXaNarq+ZMkcfdYM9+b4iUNIP+l/BmAoXRCsL3xb1uUMfapNs+lojB1UVhlutSd1Zc/XX1kRxrqZ6FKc7HXZXtP06kW+7Zr1Xl3lu+w77wXYGjQOJXqNQEMp2JIOlhwUGPeR8CzSB0tfSfH8r8xs6n7+476WhF5VrRl9ZF3WwKetGcOe6vLn3W4vnfRRR4XlE7kR7KwG74WD6cFg7F9Rcs0fw//j4hf8IEX64nj2VpENsQINGtBQDuoKwNbsNx7o1SOvtN+T+FgLtiSBZbvB3A1oSFuFma+gd4ChEK/54WRcIFiyB9QVgo9bwY77oC6vT7s2q1+1vkSgNltgZRhYuhOthaGvSPoXEb0AjinLoVZvAx+eAttKwI4HAnXZps+a43p0tySLLA0TWBCKlrt7en6uL3F2ay+bHtSuWRBiKA9Z0lH2lc2/1zUhdJavde+sDgqRG+Z/8aR5zob6+LfDyo/3eaTZbUr1LoH18QJbknuy4YY1H/ygYObnQve9sz3y29RWGYZSqzb9XUvq8q2py37zWVthYKperRr50gCtWf5/astzLtWX9GVXrSUfay0o11p1txX0flx/sxfLDluw7KiC2gxztmaO5oOLb7LqkvCsLV961l4psKsO7KoBDaWgNgNsSbR9qsuar3xpAG3iu8tbkq2oV4Nd9eCTNrDjIdiaI7AhSmT1WRPWXFSw44HItkIFm2KGsiFaYnOaQJ1aYEc12PkINFQI1OWJ1Cb3K9cmj7d9Oflj3UzqI20u1l5VsPa6wMZbYH0kWBkOqr8RmL1ZwYzPzFjxXW82Rlmw9rIpq8+bsuSwgvk7FCzeKbLyKFgVDpYfBSvCRdbdsr5G+pn+bsFQwOobOzvvkx4ec0+4efh//96ExXlbLe7mbgLVX4L39oP3DggsO2jB++eGsCZqCOvj+rEp/o+sjzRh5UlLVl9SsDlZweZUc9bf6cuaiP68f8SMBVvAlJVgdKBZyu7Xh8zb3n/Q3O39+8/d1qfP3NAePbxDASt80bv37MSvv9YXR0Q8yws/1Z17PKw7YfWbTF4O5m4Ai7dLrDrbly2pg2jQ/IEdVSLbK8DmTDPWx45hfdzHLD32OhuTwa5asKNSYmu2NRuiRrFotxNjAsfy2kKvZxd8fLrPzJzZHe7l1f2dp+ezXfb2+o3AbOyys1PmnDwpJ+7YwdjQUCZs3MT4NQFMXOnO1GB3ag6MYlOMBXW5Ajsegu11PdmYP5INKXPYkr6MrVlBrL48kRWHBWpzwc4a4fms3DRj1YUZjFroy59m+zBi1iyemzGDZ7y9ecrLi7vs7eUNgBK77OyUafv2ybGbNjFm3TrGrVnDBFUwk1YGM2v9UladGchHl1+jNqMnm7L7sjHLh9qsAOryAqjLW0Jd3iJq03344HgvFu8EG5MFalNF1l81Y9kBF96a9R5/9vJixLRpPDdlCk9PnsxjLi7camlpBLC1VSbv2CHHfPopo1euZNzy5Uz45BMmB33M3PVTWBDqwNzVPnwU8QYLd7zPxtS1bCtawDb1fOqL57FN7c+2og9YfcWRqatEVpwS2HBT4v2wwUxZ6Mqbkz151cODl93ded7VladdXLjXzo4bBcEIYGOjTNiyRY5etYrRQUGMCwxk4ocfMiUggOkB85m5eBFzFi5iyZopzF6xmE1ZwTRo/Ggo82V7+RwaymfRoJnB1rzpzNsxjEWfDWbxyhFMmzmesW5ujJo4kdecnfnj+PG84OTE4yNG8EuFghsBOQRQYq+NjTIuJES+ExTE6KVLGbdkCRMXLWLqggXMUCqZPXcu8z74gIU+Psz6cAmb8tawvXIGO6q82VntxY6H09heOYXtFZ68e8yDKa5uzHSeyJQJzox3cuKdceN4Y+xYXnF05GlbW+5TKLgdYCggrwOU2DtokDJ61Sr59tKlvDN/PuPmzWOSvz9T/fyY6ePD3NmzWTBzJou9vZm5eAGbCteys3oKu+o8KTd6UG5wZ2eNKzurXFh8ZALT3nVizrhxTH/nHSaNGcPoUaMYaW/PH6yseFQUuR/gToBbXgDs799fGRUYKEfNn887vr6MmzOHSbNmMW3GDGZ5ezPfy4tF06ZR4+nJDOU8Nqk/ZVedKx+3TOQTvTOftE2g3OTErppxLAp7h+mjRzPfwYHpw4YxftAg3rCwYIQk8SzAEwAPA9wDcOsvAH36KG8sXCjf8vXl7fffZ5y3N5O8vJg+dSpzPD1Z4OHBkkmTWO7qynRfPzaq11GuH8PHutHslh34tPPPlJvt2fXIljk7BzDpNSvmmpkxRZIYA/AGwCsAzwMMB3gE4H6A214AHLK2Vkb6+Mg3vL15e+pUxnp6MsnDg+nu7sx1dWWhszNLHB1ZZmfHJEdH1mX6srOqJ+XGHnyiV/CJTmJXnciO+wKzQgUmA8wHmA4wAeBtgFcBXgJ4BuAxgAeNAMGAEocsLZU/TZ8uX/f0ZJSbG2MnTmSSszPTx49ntoMDc/r1Y4GpKTUAU4YMZG2iO9vLwI6HArtqny+ejvsCDWUi8zcKzAKoBpgNMBlgDMDrAC8D/P5XNvwdkFcBShwyN1dGODvLkS4uvOnkxJhx45jo6MhEGxsmKxTMAlgEsBxgtk0/1ka/y7ZCgfq7Ag3lAg1lAvXFItsKRRaFCMwHeBdgLsBUgLEAbxptOAfwO4DfGgFWAErsNzNTnh89Wv5p7Fhed3TkbQcHRvXqxWjhuZzZxo7uASwY3Iu110ZRmy6wNVukLk+kLldka5ZIbbrIkmCRaoCaX9kQ9zsAYUYLPgGU2G9qqjw7fLh8+a23eHXkSP5sbc1rAKONEv4aoHigJWsuDmdTjMjmBInNSRKbEyU2xUtsipWoWSHy7m8A4gHe+h2ALwB52QuA8KFD5YsjRvBS3768JAiMBHgHYBLwTxbcHWDO6vChrLsqsf66xIabEhtuSKy/JrEu0oSlQSI1RgvyAKb9CwW+Ne6BAECJvZKkPDFwoHx28GCeNTHhRePU3gaYCDATYCHAUoCl/Xrw4aG+rD1vwtpLJqyLeJ61F01Yc8GEFQESNQBLfjMDNwD+CPAHgCeNAKGAvARQ4htJ8guztu48Zm7OE8ancsF4IdIoX7RRyngriUkqcyZtkZiwWWLcZomxoRLjQiXGb5YY7S3ytrHjq8bJPw/wNMDjAA8Zl9BXAFcDnf6AHw4CA/YqFMsOmJisPgSs/taYR4xnGKA6DKgOAqo95qJql4eJatt0URU6WQxeP0kMXu8mBn82SQzeMFkM3jhSVH0O/JIhgGotoFIBqhWA6m+Aahmg+gsQ7A8E+gEDXvqj+t+KfwA908h9sFIocgAAAABJRU5ErkJggg=='
        },
        'noShakeNew':{
            'icon':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAH1klEQVRYhdWXaVDTdxrH/67Vbd3hCiGE4FFnOu0es65HZ6yd2nHbqTo7u9tpd3FXRaqVU6USuSSIBLlEMCBMW21ctx0l1LCo9VhAEiRsEI8AEgSB3AeQkEAuEgID/e6LfwxHcNce+2KfmefV/8Xn8zy/5/f8EoL4f41z584tEYvFfmKx2I/P578UERGx+H8OlUgkK3tlsj8r1do8jUbH1+p0Ip1O36LR6QUaje6SUq0+JpPJtrW0tNB+VHBHR/dalUZToNUNPB5SdkyYpXxYWopgE6bAfvsgrII0jLZwMCy9hkGldEyl0TTLZAqmWCxe+YPAiYmJP1Wq1ala/UCPuesK7PUJGP/qN3CXU+E+5Y/xwgC48gLhPOHJIgYcX7yFkToWBruboFCpGnt6ev5KEMSi7wwXiUSr5UplhVF+71u7kIkJ7ipMlPrBXeyP8ZMBcBUEwpUbCGdOEMaOU+A4RoGdFQz70WDYWRTYyjbCVF8AlUppkckU2QRBvPDc8Gv19SsUKlWl6fE1uGq2Y7LCDxMcf7hL/OE+FUAK5AfCmRsEJ3uWQEYwbOlU2FKosB6hwp5BhYl/GJreDvT09uYRBPFcg7pUplCUmh5/A1f1O5gs98NEqT8mTvuT1RcFYLww0NN6j0AWBY7MYFIgjQprChVWZggsh2mwJtMwfDEe6r6ubx/39KT91+N48qQ/cUjVNe28+j4my/0wWUZWTwoEzAjkzwjMbr8tlQprcggszBBYPqFh9BANo0k0DF1Ox5M+mayl5d7WZ8Jra2tfUyiUD613jmGy3H8GXOIPRzEVrRU70caNQRs3Bg8+3YOxAgYcWRRos1/Bg0/3Q/J5LCSfxUJa+gEsh2mkwMFQjCSEYvTIKuhuc9EplfIiIiJeWoi/SCqVHjU+EWL8wi+9YHcxee7W4nDotBpMTU1hamoKBoMBzjNr4TgWDAXnPTidTu+3oX4JCU/0CMSHwhxHh6EsAv1d7TaRSPxHHzqXxwvtl8v/NSrMgvt0ANzFAeRVKyKHzlq0HIMDejwNk8kEZ+laODKDoeRsxfj4uPebUd5Owg/RMHKAhJtj6DAfWgVN/QU8lEg+9xnIOoHgtxpZp9Vx6V0vdPyk57wLAmEt9BUY46yDPSMYypIFBA6FettvjqPDFE2HKToMeu4n6JR2Sblc7vI57b97917S4GMhXBWrvVBXvmfac4NgyV9A4PQ62NODoSyeJyBrJ+EHPO2PpcO0PwzD+8IwxH4P3e0PLdXV1ZtnCyx+KJGUDz3gwVUUAldeIFy5QXDmeiY9JwijuSt8BYrXwZZGheKUr8DIgXnVfxyG4b1hMCStQe9d4eTVq9d3zhZY0tb+qMrQ/NkcqDMnCGNsCsayKRg94SvgOLUetpSQhQUS6DDHk2f/tPrhjxgwxL2KPtEtfHPjxqHZO2GpRNLONzSWk4slOwhj2RSMHSfTkUXBCHulr8DJ9bAmh0BxcpuPgDmOTrbeWz0DxigGDDGvou/OTVy7fp05W2BJa+u9vw+KzsPBDoHjGGUmM4PhYAVjJMtXwF6wHlZmCBQF8wT622GO9a3eGMnAUMKv0COqneLza2JnCywWCBrztfevwn5iBbnVWORqtWeQG86cucpXIG8DLIdpkOf7Cpiiw8j82APfw4BhdzgGUjaj826zi8u98P6cW8Dj8SLl0la3hfMG+aId9Tws6VTY0qgwZfgK2HI3YDSRBnneAgL7w7yDZ4xiwBgZDsOucKgL9+B+6z09m81eO2cPsFisNR0dj1TGS/GwpVFhSyXTmkKmKX0BgZzXMXowFPLc7T4Cw/tIuLf6XeEw7F6O/otFaBA0NmzatIkyfxn+rEEorNQ0XoA1cxWsR0K8aWGGYDj1Zeh1WkxPT2N6ehpGoxHW7NcxkkCHLGcbXC6X95uhtw3DHzHmtN6wMxx65tvoar49XVV1meWzCQmCWHT27Nm/dLa3WQzcKPI1S6LBcph8Vi1MBlRfJmOgphADNYVQf30C1tTXyB1/5BfQVuVioLoQev5J6L9KJ9s+C26IXAHZ37IhEN55FB2dsMbnLfBE4M1/1l5SiPgw5b0JSyLNu9NHD4bObLeEUIzE08klExNGTrrnqj2t2hgZTsJ3kQKa439Cp1g0fbGyKosgiKXPEiDYbPY7d5qaH6mvnMJI8moS6IXOvGzmWDrM0fSZYXt61eZXvjMcWtZ2dN+qRE3NlSsUCmX5M+GeWMLhnNnX2CRSqHk5MKX8fC40ZgHw3lnwSF94z62LqKtreMBisd4lnvMH6rISDudAg0DYL7txFoO522COCyO32rPAe2au2tMzV5/Yie6bPNyqrbtfUlLy4UKD958lSkr23LhV29otqoPyfBoGUzdieH+4T7u9Ve8Ox1DUy9BmbEfflwWQ3G2ZqOR9/Y/o+PgtxHf5VTwrXti8efP6L85fKKtvEMilovrpvioOVKVx0LG2Qc98E/rEN6BnvgVN1h8gL0/Ck+pzaGsWTly9dv3hmTMVmQRBrCS+z/+CeeG3Y8eOt8vKyvMvX+YLBYJGTauoyd4manS33RG4HzQJXeKmJkv97QbZxUre9cKiotQNGzb8miCIF38oeH68uGzZMsbWrb/bGB0X92FSUnJ0cnJafGJi0t6oqH2/37Jly1qCIKgEQSz5scELxSKCHKrFBEH8hPiebf43dr5uJmfA/XUAAAAASUVORK5CYII=',
            'text':'Исключить из распределения'
        },
        'oldNoShakeNew': {
           'icon':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABZElEQVRYhe2WQUrDQBiFvztYi2YphfYMXQWhXRS6KSLShcfRlb2BuCgUFz2GqDdoV3YrFi/QRuviT2AIyZ+ZZBJc9MHb/DD5XjKT5MFR5RQAITCJHQLndUN7wAzYAIccfwAPQNcnOAAWwK8CTvsHmANnVeEj4NsBnPYWGJaF3wJRBXjiPTB1hY88wc0QA1t4QLXHnucvoG0TYFEDPPFTEbxH8Wl/jv1qzF6MubY2AjpagJnFXSS6MWZXxrxo/b0WYNNAgHUePLBY7CPAAWhlBQgbDNDPCjBpMMD4XwYIGwyQuQVNHsKTrAAg//O6A6zy4CBlou4Ad1qALlImtAssY78bszdjrq2NgAstAEiTsdnHMn4sgoPUqG0N8E/g1CYASI3ae4TvgEtbeKKppxA74NoVnmiANJkqj935ztNqI03GpSNGyIGz3nMbdZAysVbAK+Q9L3zVqqqFfM/Hsfson9ejNP0BfrnzVHyx+X4AAAAASUVORK5CYII=',
           'text':'Для истории исключить из распределения'
        },
        'criticalEvent': {
              'icon':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAErUlEQVRYhdXWa1BUdRgG8EdTc/ISTWPNdLFtUlwU6ICihijUKAKZgYj3y6biPYfxQ+M4zbRqkyMzuIo6iwquoUZeAitQVGyRSkoQVITFUlHQyNK2HMjzP5d9+sBRyNGphiMzvTPvl7Nnz/P7Px92D/B/HKVwbp1ankq1PI3qaQe10xupVaTfW/2am1pDEbWGI9TqC6geX+qlK8rPlHC6hlvUH3OoeZKpeuZTrV1ItXYR1drFVGuXUL2wlOqFd41dRvWnfIq9MXZTwgFAyZJs2s8HqdW8Q61mDjXPPGqeZGqe+VQ9C9qAFlGtX0+lZGWdaeEAoBTYXNr1rdSrZ1Kvnk2txtaKqZnbBpRMrbGQyjbJZi6g9IM6/eJ71M9PpX5+OvXqGQZmVhuQjVr9eipFKZWmhtMpWZTqDPrOTqSvKom+qsn0nZ9iYKa1gjzzqF7cTdUpRZkKUJxBNvXqdurl8fRVTKDvTGIL5lwSfVWT7oG0a1uoHJrnNjUcAJS8JJf2wxrqpW9R/3489VNvt2BOJ9BXaYCqplO5kEnVGRhlOkAUL6vTyuZSK4ml/nUc9W/HtWC+awVpV9Kp7IlzmR5Op2QRFaupHRtD7Xg0ta/GUiuOoXbCwHzzJvVT0yjKPyKdksV0gJI+yCbO2al+Opzq3teo7g+neiCc6mcjqOZGUM2NoHLGTuWTWIfp4QAg9sW5RMkCKjsHU/l4MJXsIVR2hVHZHUZlz1AqhydSVKyhsj++UslNdCu5iW45N8EtH4h3i4zBee0GyIUz60RuLMWOEApXCIUr9O+Y/ISWLZhgbAKVo1Mon1lF4QiIb1f4HYfVcufkEoptwRTbX6XIlCiyJIqsEAMUSrGzDchAibLlbN4T3f7Te1OtNrl0AYUziCIjiGJrcCvmQaAdIRQHY9l01OalQ2r/v+Af2VEuuWwhxZEkiqOTKI5NoSiaSlE0neL4DIrs8BbQNgO0M4x/li7lzXX+7av+7jSu7W9rXOtvv/GA/f3wNIrtoa3tZARRLp7FXzMjzP8lvH8a1lijbhdOprx5EMUWY3eN4G9fJHob11otjxxwyd7PLo4lUU4PoLxpIOVNA9lcMptX06SURx4OAA2ZI90iJ5LyRivljVaKQ+NZnzny0Vd/d67vHUt5cyBlxwDKWyX+kjfO67F3QPUAULaiX9Stz+PYlObP5rQBbDoSz7OrBto7JBwATi63pDTnx/LWuv5syhnF6g1DzX37+aep3jQs72bWMDamWtmwbzTdKRapQwGXsiO9lz/0pzc/midW+Ns7NLxgsUWqzxnFyxuCWblhSMdWDwD75zyfcuNAJC9lj2BesvnVdwLQGcBjALoCeBzAEwB6AugNwK94deCXd07Ecdf8l1IBPAXAz/isp3FvdwDdAHQxntXp34R2Mb7sB+AZAC8C6AdgEIBQAMMBjATwRrkj9Hb+yoArAGIAjAHwOoAIAEMBSAACALwC4AUAfQxcd+NQDwV0BdDDONGzAPoC6A8g8H7A+zF9Mof17T4DQDSA0QAiAYQDCAMQDMAK4GUAzwF4GkAvo8mHAu7HdDYa6WbIexgP6Q3gSaOlu9U/aVzvZdz3n+r/C9tCRBwm2zsBAAAAAElFTkSuQmCC',
              'text':'ЧС'
          },
        'other': {
            'text':'Иное'
        }
      },
// ISO-8601
      _dayNames: {
         "1":"Пнд",
         "2":"Вт",
         "3":"Ср",
         "4":"Чт",
         "5":"Пт",
         "6":"Сб",
         "7":"Вск"
      },
      labels: {
           buttons : {
               aswork:'Рабоч.',
               asholiday:'Выход.',
               asmove:'Смещ.',
               asinfo:'Инфо'
           },
           dialogs : {
               holiday:{
                title:'Выходной день',
                   comment:'Комментарий'
               },
               work:{
                   title:'Рабочий день',
                   comment:'Комментарий'
              },
               info:{
                   title:'Информация',
                   'type':'Тип:'
               },
               move:{
                   title:'Режим работы',
                   comment:'Комменатрий',
                   shift:'Смена'
               }
           }
       }
   },
_create: function(conf) {
       var self=this,
           options = self.options,
           currDate = new Date();

       $.extend(self.options,conf);


       options.currYear  = options.currYear  == null ? currDate.getFullYear() : options.currYear;
       options.currMonth = options.currMonth == null ? currDate.getMonth() + 1: options.currMonth;

       if (options.hasOwnProperty('url') && options.url != null) {
          self._remoteRefresh();
       } else {
          self._initCanvas();
       };

   },
_initCanvas : function () {
        var self = this,
            options = self.options,
            htmlHeader = '<table border="0">' +
                         '<tbody>' +
                         '  <tr> ' +
                         '   <td><input type="button" class="workcalendar-left-year workcalendar-left-btn"></td>' +
                         '   <td><input type="text" name="year" class="workcalendar-year-input" model="workcalendar-year" value="' + self.options.currYear +  '" size="4"></td>' +
                         '   <td><input type="button" class="workcalendar-right-year workcalendar-right-btn"></td>' +
                         '   <td><input type="button" class="workcalendar-left-month workcalendar-left-btn"></td>' +
                         '   <td><input type="text" name="month" class="workcalendar-month-input" model="workcalendar-year" value="' + self.options.currMonth + '" size="4"></td>' +
                         '   <td><input type="button" class="workcalendar-right-month workcalendar-right-btn"></td>' +
                         (
                         options.enableTools ? '<td><input type="button" value="' + options.labels.buttons.aswork + '" class="workcalendar-button-aswork"></td>'    +
                                               '<td><input type="button" value="' + options.labels.buttons.asholiday + '" class="workcalendar-button-asholiday"></td>' +
                                               '<td><input type="button" value="' + options.labels.buttons.asmove + '" class="workcalendar-button-asmove"></td>'    +
                                               '<td><input type="button" value="' + options.labels.buttons.asinfo + '" class="workcalendar-button-asinfo"></td>' : '') +
                         '  </tr>'   +
                         ' </tbody>' +
                         '</table>',
            moveDialog= '<div class="workcalendar-moveDialog" title="' + options.labels.dialogs.move.title +'">'    +
                '<dl>'                                                                                                     +
                '<dt><label>' + options.labels.dialogs.move.shift + '</label></dt>'                                        +
                '<dd>'                                                                                                     +
                '<select class="workcalendar-select-shift">'                                                               +
                    self._createShiftOption()                                                                              +
                '</select>'                                                                                                +
                '</dd>'                                                                                                    +
                '<dt><label>' + options.labels.dialogs.move.comment + '</label><dt>'                                       +
                '<dd><textarea class="workcalendar-moveDialog-comment"></textarea></dd>'                                   +
                '</dl>'                                                                                                    +
                '</div>',
            infoDialog = '<div class="workcalendar-infoDialog" title="' + options.labels.dialogs.info.title +'">'   +
                              '<dl>'                                                                                       +
                                    '<dt><label>' + options.labels.dialogs.info.type +'</label></dt>'                      +
                                    '<dd>'                                                                                 +
                                    '<select class="workcalendar-infoDialog-infotype" model="type">'                         +
                                         self._createInfoListOption()                                                        +
                                    '</select>'                                                                              +
                                    '</dd>'                                                                                  +
                                    '<dd><textarea class="workcalendar-infoDialog-comment" model="comment"></textarea></dd>' +
                               '</dl>'                                                                                       +
                          '</div>',
            holidayDialog = '<div class="workcalendar-holidayDialog" title="' + options.labels.dialogs.holiday.title + '">' +
                                '<dl>' +
                                    '<dt><label>' + options.labels.dialogs.holiday.comment + '</label></dt>' +
                                    '<dd><textarea class="workcalendar-holidayDialog-comment"></textarea></dd>' +
                                    self._createHours() +
                                '</div>',
            workDialog = '<div class="workcalendar-workDialog" title="' + options.labels.dialogs.work.title + '">' +
                '<dl>' +
                '<dt><label>' + options.labels.dialogs.work.comment + '</label></dt>' +
                '<dd><textarea class="workcalendar-workDialog-comment"></textarea></dd>' +
                self._createHours() +
                '</div>',
           workDialogElement,
           holidayDialogElement,
           moveDialogElement,
           infoDialogElement,
           workFlow = self._renderCalendar();

            self.element.html('<div class="workcalendar-canvas">' + htmlHeader + workFlow + workDialog + holidayDialog + moveDialog + infoDialog + '</div>');


 /*****************************************
  * Диалоги                               *
  *****************************************/

workDialogElement = self.element.find('.workcalendar-workDialog').first();
workDialogElement.frm({
           autoOpen:false,
           width: '550px',
           url:self.options.url,
           showButtons: ['save'],
           params:self.options.extParams,
           _beforesave:function (e,ev) {
               var moveComment = $(this).find('.workcalendar-workDialog-comment').val(),
                   currType='aswork';

                  if (ev.action=='save') {
                    var selected=self._getWorkCalendarParams({
                       'type':currType,
                       'extParams': {
                           newComment:moveComment
                       }
                   });

                   $.postJSON($.createUrl(self.options.url,self.options.modifyAction),selected,function (res) {
                       self._trigger('_onsenddata',{},{selected:selected,res:res,type:currType});
                       ev.parent.close();
                   });

               };

               return false;
           }
       });

holidayDialogElement = self.element.find('.workcalendar-holidayDialog').first();
holidayDialogElement.frm({
           autoOpen:false,
           url:self.options.url,
           loadAction:self.options.modifyAction,
           saveAction:self.options.modifyAction,
           width: '550px',
           params:self.options.extParams,
           showButtons: ['save'],
           _beforesave:function (e,ev) {
               var holidayComment = $(this).find('.workcalendar-holidayDialog-comment').val(),
                   currType='asholiday';

               if (ev.action=='save') {
                   var selected=self._getWorkCalendarParams({
                       'type':currType,
                       'extParams': {
                           holidayComment:holidayComment
                       }
                   });

                   $.postJSON($.createUrl(self.options.url,self.options.modifyAction),selected,function (res) {
                       self._trigger('_onsenddata',{},{selected:selected,res:res,type:currType});
                       ev.parent.close();
                   });
               };
              return false;
           }
       });


moveDialogElement = self.element.find('.workcalendar-moveDialog').first();
moveDialogElement.frm({
                           autoOpen:false,
			               width: '550px',
                           url:self.options.url,
                           loadAction:self.options.modifyAction,
                           saveAction:self.options.modifyAction,
                           showButtons: ['save'],
    params:self.options.extParams,
	        _beforesave:function (e,ev) {
                    var newShift    = $(this).find('.workcalendar-select-shift').first().val(),
                        newComment = $(this).find('.workcalendar-moveDialog-comment').val(),
                        currType='move';

                        if (ev.action=='save') {

                            var selected=self._getWorkCalendarParams({
                                'type':currType,
                                'extParams':{newShift:newShift,newComment:newComment}
                            });


                            $.postJSON($.createUrl(self.options.url,self.options.modifyAction),selected,function (res) {
                                self._trigger('_onsenddata',{},{selected:selected,res:res,type:currType});
                                ev.parent.close();
                            });
                        };

                        return false;
                  }
        });

infoDialogElement = self.element.find('.workcalendar-infoDialog').first();
infoDialogElement.frm({
                           autoOpen:false,
                           url:self.options.url,
                           loadAction:self.options.modifyAction,
                           saveAction:self.options.modifyAction,
			               width: '550px',
                           showButtons: ['save'],
                           params:self.options.extParams,
                          _beforesave:function (e,ev) {
                                var infoComment = $(this).find('.workcalendar-infoDialog-comment').val(),
                                    type        = $(this).find('.workcalendar-infoDialog-infotype').val(),
                                    currType='info';

                                   if (ev.action=='save') {
                                       var selected=self._getWorkCalendarParams({
                                           'type':currType,
                                           'extParams': {
                                               newComment:infoComment,
                                               type:type
                                           }
                                       });
                                       $.postJSON($.createUrl(self.options.url,self.options.modifyAction),selected,function (res) {
                                           self._trigger('_onsenddata',{},{selected:selected,res:res,type:currType});
                                           ev.parent.close();
                                       });
                                   };

                                   return false;
                          }
        });


 /****************************************
  * События на изменение ячеек таблицы   *
  ****************************************/

  self.element.find('td.workcalendar-table-td').mousedown(function(){
    $(this).toggleClass('workcalendar-selected');

     self.element.find('td.workcalendar-table-td').on('mouseenter',function(){
      $(this).toggleClass('workcalendar-selected');
    });

  }).mouseup(function(){
    $('td.workcalendar-table-td').off('mouseenter');
  });

  self.element.find('td.workcalendar-table-td').dblclick(function () {
      var currElement=$(this),
          currDateIndex = self._getCurrYearMonth() + self._digitWithZero(currElement.data('day')),
          currPersonId  = self._getCellPersonId(currElement);

      //Снимаем выделение со всего, что было выделено
      self.element.find('td.workcalendar-table-td').removeClass('workcalendar-selected');

      //Выделяем ячейку на которой прошел двойной клик
      currElement.addClass('workcalendar-selected');

      //Определяем ее тип и в зависимости от этого вызываем соответтвующее окно
      if (currElement.hasClass('workcalendar-table-td-asinfo')) {
          infoDialogElement.frm('setParam','currDateIndex',currDateIndex);
          infoDialogElement.frm('setId',currPersonId);
          infoDialogElement.frm('open');
          return;
      };



  });

 /*****************************************************
  * События обработки кнопок изменения года.          *
  *****************************************************/
  $(self.element.find('.workcalendar-left-year').first()).click(function (e) {
        var el       = self.element.find('.workcalendar-year-input').first(),
            newYear  = self._calcNewYear($(el).val(),-1),
            newMonth = $(self.element.find('.workcalendar-month-input').first()).val();
       
        $(el).val(newYear);

         self.options.currYear = newYear;
         self.options.currMonth = newMonth;

        if (self._trigger('_onchangeperiod',{},{
                                        year:newYear,
                                        month:newMonth
                                       })===false) {
           return false;
        };

        self._remoteRefresh();
        return false;
       
  });

  $(self.element.find('.workcalendar-right-year').first()).click(function (e) {
        var el = $(self.element.find('.workcalendar-year-input').first());
            newYear  = self._calcNewYear($(el).val(),1),
            newMonth = $(self.element.find('.workcalendar-month-input').first()).val();

        $(el).val(newYear);

         self.options.currYear = newYear;
         self.options.currMonth = newMonth;
       
        if (self._trigger('_onchangeperiod',{},{
                                        year:newYear,
                                        month:newMonth
                                       })===false) {
           return false;
        };

        self._remoteRefresh();
        return false;

  });

 /*****************************************************
  * События обработки кнопок изменения месяца.        *
  *****************************************************/

  $(self.element.find('.workcalendar-left-month').first()).click(function (e) {
        var currYear     = self.element.find('.workcalendar-year-input').first().val(),
            currMonth    = self.element.find('.workcalendar-month-input').first().val(),
            yearMonthObj = self._calcNewMonth(currYear,currMonth,-1),
            newYear      = yearMonthObj.year,
            newMonth     = yearMonthObj.month,
            el;


        el = self.element.find('.workcalendar-year-input').first();
        $(el).val(newYear);

        el = self.element.find('.workcalendar-month-input').first();
        $(el).val(newMonth);

         self.options.currYear  = newYear;
         self.options.currMonth = newMonth;

        if (self._trigger('_onchangeperiod',{},{
                                        year:newYear,
                                        month:newMonth
                                       })===false) {
           return false;
        };

        self._remoteRefresh();

      return false;

    });

  $(self.element.find('.workcalendar-right-month').first()).click(function (e) {
        var currYear     = self.element.find('.workcalendar-year-input').first().val(),
            currMonth    = self.element.find('.workcalendar-month-input').first().val(),
            yearMonthObj = self._calcNewMonth(currYear,currMonth,1),
            newYear      = yearMonthObj.year,
            newMonth     = yearMonthObj.month,
            el;


        el = self.element.find('.workcalendar-year-input').first();
        $(el).val(newYear);

        el = self.element.find('.workcalendar-month-input').first();
        $(el).val(newMonth);

         self.options.currYear  = newYear;
         self.options.currMonth = newMonth;

        if (self._trigger('_onchangeperiod',{},{
                                        year:newYear,
                                        month:newMonth
                                       })===false) {
           return false;
        };

        self._remoteRefresh();
           return false;

    });

 /****************************************************
  * События нажатия на кнопки изменения статуса дня  *
  ****************************************************/

        self.element.find('.workcalendar-button-aswork').first().click(function (e) {
            workDialogElement.frm('setId',null);
            workDialogElement.frm('open');
            return;
        });

        self.element.find('.workcalendar-button-asholiday').first().click(function (e) {
            holidayDialogElement.frm('setId',null);
            holidayDialogElement.frm('open');
            return;
        });

       self.element.find('.workcalendar-button-asmove').first().click(function(e){
           moveDialogElement.frm('setId',null);
           moveDialogElement.frm('open');
           return;
       });

       self.element.find('.workcalendar-button-asinfo').first().click(function(e){
           infoDialogElement.frm('setId',null);
           infoDialogElement.frm('open');
           return;
       });


   },
_renderCalendar:function () {
      var self=this,
          employees = self.options.employees,
          html = '',
          th = '';

      
      html = '<table border="1" class="workcalendar-table">' + 
             '<thead>';

        tr = '<tr>';
        tr = tr + '<th rowspan="2"> N </th>' + 
                  '<th rowspan="2"> ФИО </th>';

         for (i=1;i<self._getDaysInMonth(self.options.currYear,self.options.currMonth) + 1;i++) {
             tr = tr + '<th class="' + self._getGlobalDayStatus(self.options.currYear,self.options.currMonth,i) + '">' + i + '</th>';
         };

        tr = tr + '</tr>';

        tr = tr + '<tr>';

         for (i=1;i<self._getDaysInMonth(self.options.currYear,self.options.currMonth) + 1;i++) {
             tr = tr + '<th class="' + self._getGlobalDayStatus(self.options.currYear,self.options.currMonth,i) + '">' + self.options._dayNames[self._getDayOfWeek(self.options.currYear,self.options.currMonth,i)] + '</th>';
         };

        tr = tr + '</tr>' +
                  '</thead>';

      html = html + tr + self._renderTable();
      html = html + '</table>';
    return html;
  },

_renderTable: function () {
      var self = this,
          employees = self.options.employees,
          employeDayStatus,
          currYear  = self.options.currYear,
          currMonth = self.options.currMonth,
          currDay,
          tr  = '',
          tbl = '',
          status,
          iCount = 1,
          eventTd=null;


      $.each(employees,function (id,employe) {
        tr = '<tr data-id="' + id + '">' +
            '<td>' + iCount + '</td>' +
            '<td>' + employe.title + '</td>';

         for (i=1;i<self._getDaysInMonth(currYear,currMonth) + 1;i++) {
             currDay = i;
             status = self._getWorkStatus(id,currYear,currMonth,currDay);

             eventTd=self._trigger('_onrederday',{},{currYear:currYear,currMonth:currMonth,currDay:currDay,employeId:id,employe:employe});


             if (eventTd===false) {
                 continue;
             };

             tr = tr + (eventTd==null || eventTd ? '<td class="workcalendar-table-td ' +
                                                               self._getGlobalDayStatus(self.options.currYear,self.options.currMonth,i) +
                                                               ' ' +
                                                              self._getEmployeDayStatus(id,self.options.currYear,self.options.currMonth,i) + '"' +
                                                              ' data-id="' + id + '" data-day="' + i + '">' + status.text + '</td>' : eventTd);
         };          
         tr = tr + '</tr>';
         tbl = tbl + tr;
        iCount++;
      });
   return tbl;

  },
_getWorkStatus: function (employeeId,currYear,currMonth,currDay) {
        var self = this,
            currDateIndex = currYear + self._digitWithZero(currMonth) + self._digitWithZero(currDay),
            tA={},
            r = {
                employeDayStatus:'workcalendar-table-td-common',
                text:'X'
            },
            icon;

        if (self.options.employees.hasOwnProperty(employeeId) && self.options.employees[employeeId].hasOwnProperty('daysObject') && self.options.employees[employeeId].daysObject.hasOwnProperty(currDateIndex)) {
            tA = self.options.employees[employeeId].daysObject[currDateIndex];
        };


        //Нет никакой информациии о ячейке
        if (!tA.hasOwnProperty('type')) {
             return r;
        };



        switch (tA.type) {
             case "holiday":
                 r.employeDayStatus='workcalendar-table-td-asholiday';
                 break;
             case "work":
                r.employeDayStatus='workcalendar-table-td-aswork';
                break;
             case "move":
                r.employeDayStatus='workcalendar-table-td-asmove';
                 if (tA.hasOwnProperty('extParams') && tA.extParams != undefined && tA.extParams.hasOwnProperty('newShift')) {
                     r.text=tA.extParams.newShift;
                 };
                 break;
             case "info":
                 r.employeDayStatus='workcalendar-table-td-asinfo';
                     if (self.options.typeList.hasOwnProperty(tA.type) && self.options.typeList[tA.type].hasOwnProperty('icon')) {
                         icon=self.options.typeList.hasOwnProperty(tA.type) ? self.options.typeList[tA.type].icon : self.options._defIcon;
                         r.text='<img src="' + icon + '"  class="workcalendar-table-td-icon">'

                     };
                break;
      };

     return r;
  },
_getGlobalDayStatus: function (currYear,currMonth,currDay) {
        var self   = this,
            result = '';

        if ($.inArray(self._getDayOfWeek(currYear,currMonth,currDay),self.options.holidayWeekDay) != -1) {
            result = result + 'workcalendar-td-holiday';
        };
        return result;         
  },
_getEmployeDayStatus: function (employeId,currYear,currMonth,currDay) {
        var self   = this,
            result = '',
            currDateIndex = currYear + self._digitWithZero(currMonth) + self._digitWithZero(currDay),
            currDateObj ;


        if (!self.options.employees[employeId].hasOwnProperty('daysObject')) {
            return '';
        };

        if (!self.options.employees[employeId].daysObject.hasOwnProperty(currDateIndex)) {
            return '';
        };


        currDateObj =self.options.employees[employeId].daysObject[currDateIndex];

         if (!currDateObj.hasOwnProperty('type')) {
                return '';
         };

        switch (currDateObj.type) {
             case "holiday":
                   return 'workcalendar-table-td-asholiday';
              break;
              case "work":
                   return 'workcalendar-table-td-aswork';
               break;                 
               case "move":
                    return 'workcalendar-table-td-asmove';
               break;                 
               case "info":
                   return 'workcalendar-table-td-asinfo';
               break;
         };

        
        return result;
  },
_getDayOfWeek  : function (year,month,day) {
     /*************************************
      * In standart   ISO-8601            *
      * Monday - 1                        *
      * Sun    - 7                        *
      *************************************/
      var currDate = new Date(year,month - 1,day),
           currDay = currDate.getDay() == 0 ? 7 : currDate.getDay();      
      return currDay;
  },
_getDaysInMonth: function (year,month) {
     /**************************************
      * Get from Stackoverlow
      * https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
      **************************************/
     return new Date(year,month, 0).getDate();
  },
_calcNewYear:function(iYear,iDiff) {
    return parseInt(iYear) + parseInt(iDiff);
 },
_calcNewMonth:function(iYear,iMonth,iDiff) {
    var newYear = parseInt(iYear),
        newMonth = parseInt(iMonth) + parseInt(iDiff);

 

    if (newMonth > 12) {
       newMonth = 1;
       newYear = newYear + 1;
    };

    if (newMonth < 1) {
       newMonth = 12;
       newYear = newYear - 1;
    };
    return {
             year  : newYear,
             month : newMonth
           };
 },
_digitWithZero: function (iDigit) {
      return iDigit<10 ? '0' + iDigit : '' + iDigit;
 },
_remoteRefresh: function () {
    var self = this,
        options = self.options,
        params = {};

        $.extend(params,options.extParams,{currYear:options.currYear,currMonth:options.currMonth});


     if (options.hasOwnProperty('url') && options.url != null) {

          $.postJSON($.createUrl(self.options.url,self.options.defAction),params,function (r) {
               if (r.hasOwnProperty('employees')) {
                   self.options.employees = r.employees;
                   self._initCanvas();      
               };
          });
     } else {
         self._initCanvas();
     };
 },
_getWorkCalendarParams    : function (params) {
         var selected     = {},
             currType     = params.type,
             self         = this,
             params;


       $.each(self.element.find('.workcalendar-selected'),function (i,el) {
           var currElement = $(el),
               currDateIndex = self._getCurrYearMonth() + self._digitWithZero(currElement.data('day')),
               tA = {},
               currPersonId = self._getCellPersonId(currElement);
                   
                   if (selected.hasOwnProperty(currPersonId)) {
                       tA[currDateIndex] = {currDateIndex:currDateIndex,type:currType,extParams:params.extParams};
                       $.extend(selected[currPersonId].daysObject, tA);
                   }
                   else {
                     tA[currDateIndex] = {currDateIndex:currDateIndex,type:currType,extParams:params.extParams};
                     selected[currPersonId]= {daysObject:tA};
                   };

       });

       params={selected:selected};

       $.extend(params,self.options.extParams);

       $.each(selected,function (i,s) {
           $.extend(self.options.employees[i].daysObject,s.daysObject);
       });

       if (self._trigger('_onchangedata',{},{selected:selected,type:currType})===false) {
         return false;
       };

      return params;
 },
_createShiftOption: function () {
     var self=this,
         r='';
     $.each(self.options.shiftList,function (k,v) {
         r += '<option value="' + v.value + '">' + v.option + '</option>';
     });
     return r;
 },
_createShiftOption: function () {
     var self=this,
         r='';
     $.each(self.options.shiftList,function (k,v) {
         r += '<option value="' + v.value + '">' + v.option + '</option>';
     });
     return r;
 },
_createInfoListOption: function () {
     var self=this,
         r='';

     $.each(self.options.typeList,function (k,v) {
        r += '<option value="' + k + '">' + v.text + '</option>';
     });
   return r;
 },
_getCellPersonId:function (currElement) {
        return currElement.parent().first().data('id');
    },
_createHours:function () {
     return '';
 },
_getCurrYearMonth: function () {
    var  self=this,
         el;

    el = self.element.find('.workcalendar-year-input').first();
    currYear = $(el).val();

    el = self.element.find('.workcalendar-month-input').first();
    currMonth = $(el).val();

    return currYear + self._digitWithZero(currMonth);

}
});
})( jQuery );