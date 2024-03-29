module.exports = {
  query({ sql, params }, connection) {
    return new Promise((resolve, reject) => {
      if (params) {
        connection.query(sql, params, (error, results, fields) => {
          if (error) reject(error);

          resolve({ results, fields });
        })
      } else {
        connection.query(sql, (error, results, fields) => {
          if (error) reject(error);

          resolve({ results, fields });
        });
      }
    })
  },
  // function to calculate string distance (Jaro Winkler Algorithm)
  // https://github.com/zdyn/jaro-winkler-js/blob/master/jaro-winkler-js.min.js
  jaroWinkler(str, c) {
    var a; a = str; var h, b, d, k, e, g, f, l, n, m, p; a.length > c.length && (c = [c, a], a = c[0], c = c[1]); k = ~~Math.max(0, c.length / 2 - 1); e = []; g = []; b = n = 0; for (p = a.length; n < p; b = ++n)for (h = a[b], l = Math.max(0, b - k), f = Math.min(b + k + 1, c.length), d = m = l; l <= f ? m < f : m > f; d = l <= f ? ++m : --m)if (null == g[d] && h === c[d]) { e[b] = h; g[d] = c[d]; break } e = e.join(""); g = g.join(""); if (d = e.length) {
      b = f = k = 0; for (l = e.length; f < l; b = ++f)h = e[b], h !== g[b] && k++; b = g = e = 0; for (f = a.length; g < f; b = ++g)if (h = a[b], h === c[b]) e++; else break; a = (d / a.length +
        d / c.length + (d - ~~(k / 2)) / d) / 3; a += 0.1 * Math.min(e, 4) * (1 - a)
    } else a = 0; return a
  }
}