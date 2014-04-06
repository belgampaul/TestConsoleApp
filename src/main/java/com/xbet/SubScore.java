package com.xbet;

import org.codehaus.jackson.annotate.JsonProperty;

/**
 * User: ikka
 * Date: 4/3/14
 * Time: 1:26 AM
 */
public class SubScore {
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
