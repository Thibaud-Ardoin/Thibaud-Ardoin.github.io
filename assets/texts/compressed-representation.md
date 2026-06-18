## Background 📚

We showed previously that a prompt can be compressed [1]. With it is compressed the instruction or the factual information that the LLM should work on. The result should a drastic compression with minimal loss on information.

Many activation engeneering methods use the last token as a global representation of the sentence, some are acting regardless on all the token of the sequence [2].

```
🔍 What if a trained weighted sum is a better LLM representation ?

```

## Goal 🎯

Improving activation engeneering with a simple improvement in the chain of information extraction.




## References

[1] Ardoin, et. al (2026) *Prompt Compression* Under review.

[2] Ardoin, et. al (2026). *LLM Self-Recognition: Steering and Retrieving Activation Signatures*. ICML'26: https://arxiv.org/abs/2606.06315
