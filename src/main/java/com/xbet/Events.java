
package com.xbet;

import org.codehaus.jackson.annotate.JsonProperty;

public class Events {
  private boolean b;
  private Number c;
  private Number g;
  private Number p;
  private String pl;
  private Number t;

  public boolean getB() {
    return this.b;
  }

  @JsonProperty("B")
  public void setB(boolean b) {
    this.b = b;
  }

  public Number getC() {
    return this.c;
  }

  /**
   * koef
   * @param c
   */
  @JsonProperty("C")
  public void setC(Number c) {
    this.c = c;
  }

  public Number getG() {
    return this.g;
  }

  @JsonProperty("G")
  public void setG(Number g) {
    this.g = g;
  }

  public Number getP() {
    return this.p;
  }

  @JsonProperty("P")
  public void setP(Number p) {
    this.p = p;
  }

  public String getPl() {
    return this.pl;
  }

  @JsonProperty("Pl")
  public void setPl(String pl) {
    this.pl = pl;
  }

  /**
   * type
   * // П1
   case 1:
   // Х
   case 2:
   // П2
   case 3:
   // П1X
   case 4:
   cf4 = parseFloat(koef);
   // 12
   case 5:
   cf5 = parseFloat(koef);
   est_dc_cf = 1;
   break;
   // П2Х
   case 6:
   cf6 = parseFloat(koef);
   est_dc_cf = 1;
   break;
   // Фора 1
   case 7:
   cf7 = parseFloat(koef);
   cff_prm_7 = parseFloat(res.Value[i].Events[j].P);
   est_fora = 1;
   break;
   // Фора 2
   case 8:
   cf8 = parseFloat(koef);
   cff_prm_8 = parseFloat(res.Value[i].Events[j].P);
   est_fora = 1;
   break;
   // Тотал Б
   case 9:
   cf9 = parseFloat(koef);
   cft_prm = parseFloat(res.Value[i].Events[j].P);
   est_total = 1;
   break;
   // Тотал М
   case 10:
   cf10 = parseFloat(koef);
   cft_prm = parseFloat(res.Value[i].Events[j].P);
   est_total = 1;
   break;
   // Поинты
   case 864:
   cf11 = parseFloat(koef);
   cfp_prm = parseFloat(res.Value[i].Events[j].P);
   var cfp_point = parseInt(cfp_prm);
   var cfp_num = Math.round((res.Value[i].Events[j].P - cfp_point) * 1000);
   est_points = 1;
   break;
   // Поинты
   case 865:
   cf12 = parseFloat(koef);
   cfp_prm = parseFloat(res.Value[i].Events[j].P);
   var cfp_point = parseInt(cfp_prm);
   var cfp_num = Math.round((res.Value[i].Events[j].P - cfp_point) * 1000);
   est_points = 1;
   break;
   // Геймы П1
   case 50: case 52: case 54: case 56: case 702: case 704:
   cf13 = parseFloat(koef);
   cfg_prm = parseFloat(res.Value[i].Events[j].P);
   est_wingame = 1;
   break;
   // Геймы П2
   case 51: case 53: case 55: case 57: case 703: case 705:
   cf14 = parseFloat(koef);
   cfg_prm = parseFloat(res.Value[i].Events[j].P);
   est_wingame = 1;
   break;
   default:
   break;
   * @return
   */
  public Number getT() {
    return this.t;
  }

  @JsonProperty("T")
  public void setT(Number t) {
    this.t = t;
  }
}
