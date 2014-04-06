
package com.xbet;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PeriodScores {

  public class Value{
    private String sc1;
    private String sc2;

    public String getSc1() {
      return this.sc1;
    }

    @JsonProperty("Sc1")
    public void setSc1(String sc1) {
      this.sc1 = sc1;
    }

    public String getSc2() {
      return this.sc2;
    }

    @JsonProperty("Sc2")
    public void setSc2(String sc2) {
      this.sc2 = sc2;
    }
  }

  private PeriodScores.Value value;

  private Number key;


  public Number getKey() {
    return this.key;
  }

  @JsonProperty("Key")
  public void setKey(Number key) {
    this.key = key;
  }

  public PeriodScores.Value getValue() {
    return this.value;
  }

  @JsonProperty("Value")
  public void setValue(PeriodScores.Value value) {
    this.value = value;
  }
}
