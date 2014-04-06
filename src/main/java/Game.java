import org.codehaus.jackson.annotate.JsonIgnoreProperties;

/**
 * User: ikka
 * Date: 4/2/14
 * Time: 6:16 AM
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Game {
  private Long id;
  private Long gs;
  private String ts;
  private String tsc;
  private String bs;
  private String bsc;
  private String atn;
  private String atv;
  private String ats;
  private String atc;
  private String htn;
  private String htv;
  private String hts;
  private String htc;
  private Boolean pl;
  private Boolean rl;
  private Boolean vl;
  private Boolean gcl;
  private Boolean gcll;
  private String ustv;
  private String catv;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getGs() {
    return gs;
  }

  public void setGs(Long gs) {
    this.gs = gs;
  }

  public String getTs() {
    return ts;
  }

  public void setTs(String ts) {
    this.ts = ts;
  }

  public String getTsc() {
    return tsc;
  }

  public void setTsc(String tsc) {
    this.tsc = tsc;
  }

  public String getBs() {
    return bs;
  }

  public void setBs(String bs) {
    this.bs = bs;
  }

  public String getBsc() {
    return bsc;
  }

  public void setBsc(String bsc) {
    this.bsc = bsc;
  }

  public String getAtn() {
    return atn;
  }

  public void setAtn(String atn) {
    this.atn = atn;
  }

  public String getAtv() {
    return atv;
  }

  public void setAtv(String atv) {
    this.atv = atv;
  }

  public String getAts() {
    return ats;
  }

  public void setAts(String ats) {
    this.ats = ats;
  }

  public String getAtc() {
    return atc;
  }

  public void setAtc(String atc) {
    this.atc = atc;
  }

  public String getHtn() {
    return htn;
  }

  public void setHtn(String htn) {
    this.htn = htn;
  }

  public String getHtv() {
    return htv;
  }

  public void setHtv(String htv) {
    this.htv = htv;
  }

  public String getHts() {
    return hts;
  }

  public void setHts(String hts) {
    this.hts = hts;
  }

  public String getHtc() {
    return htc;
  }

  public void setHtc(String htc) {
    this.htc = htc;
  }

  public Boolean getPl() {
    return pl;
  }

  public void setPl(Boolean pl) {
    this.pl = pl;
  }

  public Boolean getRl() {
    return rl;
  }

  public void setRl(Boolean rl) {
    this.rl = rl;
  }

  public Boolean getVl() {
    return vl;
  }

  public void setVl(Boolean vl) {
    this.vl = vl;
  }

  public Boolean getGcl() {
    return gcl;
  }

  public void setGcl(Boolean gcl) {
    this.gcl = gcl;
  }

  public Boolean getGcll() {
    return gcll;
  }

  public void setGcll(Boolean gcll) {
    this.gcll = gcll;
  }

  public String getUstv() {
    return ustv;
  }

  public void setUstv(String ustv) {
    this.ustv = ustv;
  }

  public String getCatv() {
    return catv;
  }

  public void setCatv(String catv) {
    this.catv = catv;
  }

  @Override
  public String toString() {
    return "Game{" +
        "id=" + id +
        ", gs=" + gs +
        ", ts='" + ts + '\'' +
        ", tsc='" + tsc + '\'' +
        ", bs='" + bs + '\'' +
        ", bsc='" + bsc + '\'' +
        ", atn='" + atn + '\'' +
        ", atv='" + atv + '\'' +
        ", ats='" + ats + '\'' +
        ", atc='" + atc + '\'' +
        ", htn='" + htn + '\'' +
        ", htv='" + htv + '\'' +
        ", hts='" + hts + '\'' +
        ", htc='" + htc + '\'' +
        ", pl=" + pl +
        ", rl=" + rl +
        ", vl=" + vl +
        ", gcl=" + gcl +
        ", gcll=" + gcll +
        ", ustv='" + ustv + '\'' +
        ", catv='" + catv + '\'' +
        '}';
  }
}
